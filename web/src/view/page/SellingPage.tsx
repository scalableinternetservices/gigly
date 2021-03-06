import { useQuery } from '@apollo/client'
import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import Modal from 'react-modal'
import { getApolloClient } from '../../graphql/apolloClient'
import {
  FetchListings,
  FetchListingsPaginated,
  FetchListingsPaginatedVariables,
  FetchListings_listings,
  TagType,
} from '../../graphql/query.gen'
import { style } from '../../style/styled'
// import { fetchUser3 } from '../auth/fetchUser'
// import { fetchUserFromID } from '../auth/fetchUser'
import { AppRouteParams } from '../nav/route'
import { toast } from '../toast/toast'
import { Popup } from './components/Popup'
import { fetchListings, fetchListingsPaginated } from './fetchListings'
import { editListing } from './mutateListings'
import { addTag } from './mutateTags'
import { Page } from './Page'

const customStyles = {
  content: {
    backgroundColor: 'transparent',
    border: 'none',
    paddingTop: '0px',
    overflow: 'hidden',
  },
}

const customStylesEdit = {
  content: {
    backgroundColor: 'white',
    border: 'none',
    paddingTop: '0px',
    overflow: 'hidden',
  },
}
interface LecturesPageProps extends RouteComponentProps, AppRouteParams {}

interface CardData {
  id: number
  serviceName: string
  username: string
  profPic: string
  price: number
  image: string
  tags: TagType[]
}

enum HeaderItems {
  MOST_RECENT = 'Most Recent',
  LOW_TO_HIGH = 'Low to High',
}

function getCard(c: CardData, setCardToEdit: (id: number) => void) {
  return (
    <Card
      $img={c.image}
      key={c.id}
      onClick={() => {
        setCardToEdit(c.id)
      }}
    >
      <CardInfo>
        <div
          style={{
            backgroundColor: 'white',
            paddingLeft: '15px',
            fontWeight: 'bold',
            paddingRight: '15px',
            paddingTop: '8px',
            borderRadius: '25px 25px 0px 0px',
            color: '#696969',
            width: '250px',
          }}
        >
          {c.serviceName}
        </div>
        <div
          className="flex flex-row"
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: '5px',
            paddingLeft: '5px',
            paddingBottom: '5px',
            backgroundColor: 'white',
            borderRadius: '0px 0px 25px 25px',
          }}
        >
          <UserPic $img={c.profPic} />
          <div style={{ paddingLeft: '15px', color: '#696969' }}>{c.username}</div>
          <div style={{ paddingLeft: '25px', color: '#3C82DC' }}>{'$' + c.price}</div>
        </div>
      </CardInfo>
    </Card>
  )
}

const sortHeaderItems = [HeaderItems.MOST_RECENT, HeaderItems.LOW_TO_HIGH]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const Pictures = (id: number) => {
//   const { loading: userLoading, data: userData } = useQuery(fetchUserFromID, {
//       variables: { userId: id },
//     })
//     return userData
// }

export function SellingPage(props: LecturesPageProps) {
  const [search, setSearch] = React.useState<string>('')
  const { data: _ } = useQuery<FetchListings>(fetchListings)
  const { data, fetchMore: paginatedFetchMore } = useQuery<FetchListingsPaginated, FetchListingsPaginatedVariables>(
    fetchListingsPaginated,
    {
      variables: {
        input: { offset: 0, limit: 1 },
      },
      fetchPolicy: 'cache-and-network',
    }
  )
  const [selectedSort, setSelectedSort] = React.useState<HeaderItems>(HeaderItems.MOST_RECENT)
  const [listingToEdit, setListingToEdit] = React.useState<number>(0) // 0 means don't show the editing window!
  const [serviceNameEdited, setServiceNameEdited] = React.useState<string>('')
  const [servicePriceEdited, setServicePriceEdited] = React.useState<number | null>(null)
  const [serviceStartDateEdited, setServiceStartDateEdited] = React.useState<string>('')
  const [serviceEndDateEdited, setServiceEndDateEdited] = React.useState<string>('')
  const [serviceLocationEdited, setServiceLocationEdited] = React.useState<string>('')
  const [serviceDescriptionEdited, setServiceDescriptionEdited] = React.useState<string>('')
  const [serviceImageEdited, setServiceImageEdited] = React.useState<string>('')
  const [showPopup, setShowPopup] = React.useState<boolean>(false)
  const [showTags, setShowTags] = React.useState<TagType[]>([])
  const tagtypes = [TagType.GROCERIES, TagType.HAIRCUT, TagType.TUTORING, TagType.OTHER]
  const [selectedTypes, _setSelectedTypes] = React.useState<TagType[]>([])
  const [limit, setLimit] = React.useState<number>(1)

  // const { loading: userLoading, data: userData } = useQuery(fetchUserFromID, {
  //   variables: { userId: data?.listings.listing.userId_ref },
  // })

  // const [go, setGo] = React.useState<boolean>(false)
  // Function passed to each card to set the state to the listing to be edited
  const setCardToEdit = (id: number) => {
    setListingToEdit(id)
    setShowPopup(true)
  }

  const _setShowTags = (tag: TagType) => {
    if (!showTags.includes(tag)) setShowTags(showTags.concat(tag))
    else setShowTags(showTags.filter(t => t !== tag))
  }

  let cards: CardData[] = []
  if (data) {
    const cards: CardData[] = []
    data?.listingsPaginated?.map((listing, index) => {
      const tagList: TagType[] = []
      listing.tags.forEach(tag => {
        if (tag) {
          tagList.push(tag.type)
        }
      })
      // let { loading: userLoading, data: userData } = useQuery(fetchUserFromID, {
      //   variables: { userId: listing.userId_ref },
      // })
      cards.push({
        id: listing.id ?? index,
        serviceName: listing.sellingName,
        username: listing.username,
        price: listing.price ?? 0,
        image: listing.image,
        tags: tagList,

        profPic:
          // Pictures(listing.userId_ref)?.user.image ??
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      })
    })

    // Filter from searchbar
    let filteredCards = cards.filter(card => {
      return (
        card.serviceName.toLowerCase().includes(search.toLowerCase()) ||
        card.username.toLowerCase().includes(search.toLowerCase())
      )
    })
    // Filter from selected tags, if selected
    if (showTags.length !== 0)
      filteredCards = filteredCards.filter(card => {
        let show = false
        showTags.forEach(tag => {
          card.tags.forEach(t => {
            if (t === tag) show = true
          })
        })
        return show
      })
    // const {loading: loading2, data: data2} = useQuery(fetchUser3);
    // if (loading2) return (<h1>loading...</h1>)

    // Sort from low to high if that's selected, otherwise default to most recent
    if (selectedSort === HeaderItems.LOW_TO_HIGH)
      filteredCards = filteredCards.sort((a: CardData, b: CardData) => {
        return a.price - b.price
      })

    // Need to update this every time a new TagType enum is added!!
    const setSelectedTypes = (t: TagType) => {
      // If the tag isn't already selected, add it.
      if (!selectedTypes.includes(t)) {
        _setSelectedTypes(selectedTypes.concat(t))
      } else {
        // ...else, remove it
        _setSelectedTypes(selectedTypes.filter(item => item !== t))
      }
    }

    const cardUIs = filteredCards.map(card => getCard(card, setCardToEdit))

    // Get selected listing data
    // let popupData: FetchListings_listings | null = null
    let popupData: FetchListings_listings | null = null
    if (listingToEdit !== 0) {
      data?.listingsPaginated?.forEach(listing => {
        if (listing.id === listingToEdit) {
          popupData = listing
        }
      })
    }

    return (
      <>
        <Page>
          <div style={{ paddingTop: '100px' }}>
            <div
              style={{
                height: '100%',
                width: '225px',
                position: 'fixed',
                zIndex: 1,
                top: 0,
                left: 0,
                overflowX: 'hidden',
                fontFamily: 'Roboto',
              }}
            >
              <div style={{ paddingTop: '100px', height: '100%', marginRight: '30px', backgroundColor: '#C8C8C8' }}>
                <SideBarHeader>SORT</SideBarHeader>
                <SideBarItem
                  onClick={() => {
                    setSelectedSort(HeaderItems.MOST_RECENT)
                  }}
                  $clicked={selectedSort === HeaderItems.MOST_RECENT}
                >
                  Most Recent
                </SideBarItem>
                <SideBarItem
                  onClick={() => {
                    setSelectedSort(HeaderItems.LOW_TO_HIGH)
                  }}
                  $clicked={selectedSort === HeaderItems.LOW_TO_HIGH}
                >
                  Low to High
                </SideBarItem>
                <SideBarHeader>FILTER BY TAG</SideBarHeader>
                <SideBarItem
                  onClick={() => {
                    _setShowTags(TagType.GROCERIES)
                  }}
                  $clicked={showTags.includes(TagType.GROCERIES)}
                >
                  GROCERIES
                </SideBarItem>
                <SideBarItem
                  onClick={() => {
                    _setShowTags(TagType.HAIRCUT)
                  }}
                  $clicked={showTags.includes(TagType.HAIRCUT)}
                >
                  HAIRCUT
                </SideBarItem>
                <SideBarItem
                  onClick={() => {
                    _setShowTags(TagType.TUTORING)
                  }}
                  $clicked={showTags.includes(TagType.TUTORING)}
                >
                  TUTORING
                </SideBarItem>
                <SideBarItem
                  onClick={() => {
                    _setShowTags(TagType.OTHER)
                  }}
                  $clicked={showTags.includes(TagType.OTHER)}
                >
                  OTHER
                </SideBarItem>
              </div>
            </div>
            <div className="flex" style={{ flexDirection: 'column' }}>
              <input
                className="input"
                type="text"
                style={{
                  backgroundColor: 'E3E3E3',
                  borderRadius: '20px',
                  height: '5vh',
                  width: '50vw',
                  padding: '1.5rem',
                  fontFamily: 'Roboto',
                }}
                placeholder="Search"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearch(e.target.value)
                }}
              />
              <label style={{ paddingTop: '5px' }}>
                Set number to load:
                <select
                  value={limit}
                  onChange={e => {
                    setLimit(parseInt(e.target.value))
                  }}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <br />
              </label>
            </div>
            <div
              className="flex flex-row"
              style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: '80px', maxWidth: '1000px' }}
            >
              {cardUIs}
            </div>
            <div
              style={{
                fontFamily: 'Roboto',
                textAlign: 'center',
                backgroundColor: '#3C82DC',
                marginLeft: '43%',
                marginRight: '43%',
                borderRadius: '25px',
                color: 'white',
                cursor: 'pointer',
              }}
              onClick={() => {
                paginatedFetchMore({
                  variables: {
                    input: { offset: data.listingsPaginated?.length, limit },
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    return fetchMoreResult
                  },
                })
              }}
            >
              LOAD MORE
            </div>
          </div>
        </Page>
        <Modal isOpen={showPopup && listingToEdit !== 0} style={customStyles}>
          <form>
            <button
              onClick={() => {
                setListingToEdit(0)
                setShowPopup(false)
              }}
              style={{
                // marginTop: '20px',
                marginLeft: '300px',
                fontFamily: 'Roboto',
                fontSize: '0.9em',
                cursor: 'pointer',
                backgroundColor: '#E3E3E3',
                borderRadius: '12.5px',
                padding: '7.5px',
              }}
            >
              Back
            </button>
            <button
              onClick={() => {
                setListingToEdit(listingToEdit)
                setShowPopup(false)
              }}
              style={{
                // marginTop: '20px',
                marginLeft: '30px',
                fontFamily: 'Roboto',
                fontSize: '0.9em',
                cursor: 'pointer',
                backgroundColor: '#3C82DC',
                borderRadius: '12.5px',
                padding: '7.5px',
              }}
            >
              Edit
            </button>
          </form>
          <Popup listingId={listingToEdit} />
        </Modal>
        <Modal isOpen={listingToEdit !== 0 && !showPopup} style={customStylesEdit}>
          <form>
            <div style={{ paddingTop: '100px', marginLeft: '250px' }}>
              <div style={{ fontFamily: 'Roboto', fontSize: '28px' }}>Edit Listing (ID: {listingToEdit})</div>
              <input
                type="text"
                placeholder="Service Name"
                style={{
                  border: '1px solid #808080',
                  display: 'flex',
                  borderRadius: '20px',
                  padding: '5px',
                  paddingLeft: '10px',
                  margin: '5px',
                  minHeight: '13px',
                  fontSize: '0.9em',
                  color: '#303030',
                  resize: 'none',
                  width: '100%',
                  fontFamily: 'Roboto',
                }}
                onChange={e => setServiceNameEdited(e.target.value)}
              />
              <input
                type="text"
                placeholder="Service Price"
                style={{
                  border: '1px solid #808080',
                  display: 'flex',
                  borderRadius: '20px',
                  padding: '5px',
                  paddingLeft: '10px',
                  margin: '5px',
                  minHeight: '13px',
                  fontSize: '0.9em',
                  color: '#303030',
                  resize: 'none',
                  width: '100%',
                  fontFamily: 'Roboto',
                }}
                onChange={e => setServicePriceEdited(parseInt(e.target.value))}
              />
              <input
                type="date"
                placeholder="Availability: Start Date"
                style={{
                  border: '1px solid #808080',
                  display: 'flex',
                  borderRadius: '20px',
                  padding: '5px',
                  paddingLeft: '10px',
                  margin: '5px',
                  minHeight: '13px',
                  fontSize: '0.9em',
                  color: '#303030',
                  resize: 'none',
                  width: '100%',
                  fontFamily: 'Roboto',
                }}
                onChange={e => setServiceStartDateEdited(e.target.value)}
              />
              <input
                type="date"
                placeholder="Availability: End Date"
                style={{
                  border: '1px solid #808080',
                  display: 'flex',
                  borderRadius: '20px',
                  padding: '5px',
                  paddingLeft: '10px',
                  margin: '5px',
                  minHeight: '13px',
                  fontSize: '0.9em',
                  color: '#303030',
                  resize: 'none',
                  width: '100%',
                  fontFamily: 'Roboto',
                }}
                onChange={e => setServiceEndDateEdited(e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                style={{
                  border: '1px solid #808080',
                  display: 'flex',
                  borderRadius: '20px',
                  padding: '5px',
                  paddingLeft: '10px',
                  margin: '5px',
                  minHeight: '13px',
                  fontSize: '0.9em',
                  color: '#303030',
                  resize: 'none',
                  width: '100%',
                  fontFamily: 'Roboto',
                }}
                onChange={e => setServiceLocationEdited(e.target.value)}
              />
              <input
                type="text"
                placeholder="Description"
                style={{
                  border: '1px solid #808080',
                  display: 'flex',
                  borderRadius: '20px',
                  padding: '5px',
                  paddingLeft: '10px',
                  margin: '5px',
                  minHeight: '13px',
                  fontSize: '0.9em',
                  color: '#303030',
                  resize: 'none',
                  width: '100%',
                  fontFamily: 'Roboto',
                }}
                onChange={e => setServiceDescriptionEdited(e.target.value)}
              />
              <input
                type="text"
                placeholder="Image URL"
                style={{
                  border: '1px solid #808080',
                  display: 'flex',
                  borderRadius: '20px',
                  padding: '5px',
                  paddingLeft: '10px',
                  margin: '5px',
                  minHeight: '13px',
                  fontSize: '0.9em',
                  color: '#303030',
                  resize: 'none',
                  width: '100%',
                  fontFamily: 'Roboto',
                }}
                onChange={e => setServiceImageEdited(e.target.value)}
              />
              {tagtypes.map((item, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor: selectedTypes.includes(item) ? '#18A0FB' : '#C4C4C4',
                      color: 'white',
                      padding: '5px',
                      marginLeft: '2px',
                      marginRight: '2px',
                      marginBottom: '10px',
                      borderRadius: '25px',
                      display: 'inline-block',
                      cursor: 'pointer',
                      fontFamily: 'Roboto',
                    }}
                    onClick={() => {
                      setSelectedTypes(item)
                    }}
                  >
                    {item}
                  </div>
                )
              })}
              <br></br>
              <button
                onClick={() => {
                  setListingToEdit(0)
                }}
                style={{
                  fontFamily: 'Roboto',
                  cursor: 'pointer',
                  backgroundColor: '#E3E3E3',
                  borderRadius: '15px',
                  padding: '10px',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSubmit(
                    listingToEdit as number,
                    serviceNameEdited,
                    servicePriceEdited,
                    serviceStartDateEdited,
                    serviceEndDateEdited,
                    serviceLocationEdited,
                    serviceDescriptionEdited,
                    serviceImageEdited,
                    selectedTypes
                  )
                }}
                style={{
                  fontFamily: 'Roboto',
                  cursor: 'pointer',
                  backgroundColor: '#3C82DC',
                  borderRadius: '15px',
                  marginLeft: '50px',
                  padding: '10px',
                }}
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      </>
    )
  } else {
    return <div>please i just need a second :^)</div>
  }
  function handleSubmit(
    id: number,
    sellingName: string | null,
    price: number | null,
    startDate: string | null,
    endDate: string | null,
    location: string | null,
    description: string | null,
    image: string | null,
    tags: TagType[]
  ) {
    // Note that a null in the backend mutation doesn't overwrite anything! so this is safe :)
    // i.e. it only updates nonnull values, and doesn't clear out anything
    editListing(getApolloClient(), {
      id,
      username: null,
      price,
      sellingName,
      startDate,
      endDate,
      location,
      description,
      image,
    })
      .then(() => {
        tags.forEach(tag =>
          addTag(getApolloClient(), {
            type: tag,
            listingId: id,
          })
        )
      })
      .then(() => {
        window.location.reload()
        toast('submitted!')
      })
      .catch(err => {
        console.log('oops')
        console.log(err)
      })
  }
}

const Card = style('div', 'flex white items-center list pa6 ph2 ', (c: { $img?: string }) => ({
  backgroundPositionY: 'center',
  backgroundSize: 'cover',
  backgroundImage:
    c.$img !== '' && c.$img !== null && c.$img !== undefined
      ? 'url(' + c.$img + ')'
      : 'url(' +
        'https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80' +
        ')',
  paddingTop: '20px',
  paddingBottom: '10px',

  marginBottom: '8px',
  justifyContent: 'flex-start',
  minHeight: '200px',
  minWidth: '250px',
  marginRight: '10px',
  borderRadius: '25px',
  fontFamily: 'Roboto',
  cursor: 'pointer',
}))

const CardInfo = style('div', 'flex flex-column', {
  paddingTop: '100px',
})

const UserPic = style('div', (c: { $img?: string }) => ({
  width: '50px',
  height: '50px',
  borderRadius: '180px',
  border: '0.5px solid #18A0FB',
  backgroundPositionY: 'center',
  backgroundSize: 'cover',
  backgroundImage:
    c.$img !== undefined
      ? 'url(' + c.$img + ')'
      : 'url(' +
        'https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=670&q=80' +
        ')',
}))

const SideBarItem = style('div', (c: { $clicked?: boolean }) => ({
  paddingLeft: '15px',
  paddingTop: '10px',
  fontWeight: c.$clicked ? 'bold' : 'initial',
  cursor: 'pointer',
}))

const SideBarHeader = style('div', {
  paddingLeft: '15px',
  paddingTop: '50px',
  fontWeight: 'bold',
  fontSize: '24px',
})
