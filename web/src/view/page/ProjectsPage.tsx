import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { useContext } from 'react'
import { getApolloClient } from '../../graphql/apolloClient'
import { style } from '../../style/styled'
import { editUser } from '../auth/fetchUser'
import { UserContext } from '../auth/user'
import { AppRouteParams } from '../nav/route'
import { toast } from '../toast/toast'
import { Page } from './Page'

interface ProjectsPageProps extends RouteComponentProps, AppRouteParams {}
// const imageSrc = require('../../../../public/assets/julia.jpg')
// eslint-disable-next-line @typescript-eslint/no-unused-vars

interface TestUser {
  [x: string]: any
  name: string
  email: string
  phone: string
  location: string
}

export function ProjectsPage(props: ProjectsPageProps) {
  const { user: curUser } = useContext(UserContext)
  // React.useEffect(() => {
  //   editUserState({ name: user.name, email: user.email, phone: user.phone, location: user.location })
  // }, [curUser])
  if (curUser == null) {
    return (
      <Home>
        <Page>
          <CatchPhrase style={{ paddingTop: '38%' }}>We are so glad you're here!</CatchPhrase>
          <CatchPhrase>
            Make sure to{' '}
            <button
              style={{ color: 'white', textDecorationLine: 'underline' }}
              onClick={() => {
                window.location.replace('/')
              }}
            >
              login
            </button>{' '}
            to view your account :)
          </CatchPhrase>
        </Page>
      </Home>
    )
  }

  const [userPic, setUserPic] = React.useState<string>(curUser.image || '') // url to user pic
  const [about, setAbout] = React.useState<string>(curUser.about || '')

  const [editForm, showEditForm] = React.useState(false)
  const [user, editUserState] = React.useState<TestUser>({
    name: curUser.name || 'not available',
    email: curUser.email || 'not available',
    phone: curUser.number || '(123) 456 - 7890',
    location: curUser.location || 'Westwood, CA',
  })

  function handleSubmit(
    id: number,
    email: string,
    name: string,
    number: string,
    location: string,
    about: string,
    image: string
  ) {
    editUser(getApolloClient(), {
      id: id,
      email: email,
      name: name,
      number: number,
      location: location,
      about: about,
      image,
    })
      .then(() => {
        showEditForm(false)
        toast('submitted!')
      })
      .catch(err => {
        console.log('oops')
        console.log(err)
      })
  }
  return (
    <Page>
      <div style={{ marginTop: '120px' }}></div>
      <Row>
        <div style={{ flex: 1, width: '800px' }}>
          <div
            style={{
              margin: 'auto',
              width: '180px',
              height: '180px',
              borderRadius: '180px',
              border: '0.5px solid #18A0FB',
              backgroundPositionY: 'center',
              backgroundSize: 'cover',
              backgroundImage:
                'url(' +
                (userPic !== ''
                  ? userPic
                  : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png') +
                ')',
            }}
          ></div>
          <div style={{ textAlign: 'center', marginTop: '10px', fontStyle: 'italic' }}>{about}</div>
        </div>
        <div style={{ flex: 2, flexDirection: 'column' }}>
          {editForm ? (
            <form>
              <HeaderLabelText> EDIT MY INFORMATION: </HeaderLabelText>
              <FormInput>
                <input
                  type="text"
                  placeholder="name"
                  style={{ fontSize: '0.9em', color: '#303030', resize: 'none', width: '100%' }}
                  onChange={e =>
                    editUserState({
                      name: e.target.value,
                      email: user.email,
                      phone: user.phone,
                      location: user.location,
                    })
                  }
                  value={user.name}
                />
              </FormInput>
              <FormInput>
                <input
                  type="text"
                  placeholder="email"
                  style={{ fontSize: '0.9em', color: '#303030', resize: 'none', width: '100%' }}
                  onChange={e =>
                    editUserState({ name: user.name, email: user.email, phone: user.phone, location: user.location })
                  }
                  value={user.email}
                />
              </FormInput>
              <FormInput>
                <input
                  type="text"
                  placeholder="phone number"
                  style={{ fontSize: '0.9em', color: '#303030', resize: 'none', width: '100%' }}
                  onChange={e =>
                    editUserState({
                      name: user.name,
                      email: user.email,
                      phone: e.target.value,
                      location: user.location,
                    })
                  }
                  value={user.phone}
                />
              </FormInput>
              <FormInput>
                <input
                  type="text"
                  placeholder="location"
                  style={{ fontSize: '0.9em', color: '#303030', resize: 'none', width: '100%' }}
                  onChange={e =>
                    editUserState({ name: user.name, email: user.email, phone: user.phone, location: e.target.value })
                  }
                  value={user.location}
                />
              </FormInput>
              <FormInput>
                <input
                  type="text"
                  placeholder="Profile Picture URL"
                  style={{ fontSize: '0.9em', color: '#303030', resize: 'none', width: '100%' }}
                  onChange={e => setUserPic(e.target.value)}
                  value={userPic}
                />
              </FormInput>
              <FormInput>
                <input
                  type="text"
                  placeholder="About Me (Your Tagline!)"
                  style={{ fontSize: '0.9em', color: '#303030', resize: 'none', width: '100%' }}
                  onChange={e => setAbout(e.target.value)}
                  value={about}
                />
              </FormInput>
              <br />
              <SubmitButton
                type="button"
                onClick={() => {
                  handleSubmit(curUser.id, user.email, user.name, user.phone, user.location, about, userPic)
                }}
              >
                <LabelText>SUBMIT</LabelText>
              </SubmitButton>
            </form>
          ) : (
            <>
              <MyAccountInfo name={user.name} email={user.email} phone={user.phone} location={user.location} />
              {console.log('USER: ')}
              {console.log(JSON.stringify(user))}
              <SubmitButton onClick={() => showEditForm(true)} style={{ marginBottom: '16px' }}>
                <LabelText>EDIT</LabelText>
              </SubmitButton>
            </>
          )}
        </div>
      </Row>
    </Page>
  )
}

function MyAccountInfo(props: TestUser) {
  return (
    <>
      <HeaderLabelText> MY INFORMATION:</HeaderLabelText>
      <FormInput>
        <FormText>{props.name}</FormText>
      </FormInput>
      <FormInput>
        <FormText>{props.email}</FormText>
      </FormInput>
      <FormInput>
        <FormText>{props.phone}</FormText>
      </FormInput>
      <FormInput>
        <FormText>{props.location} </FormText>
      </FormInput>
    </>
  )
}

const Row = style('div', { display: 'flex', flexDirection: 'row' })
const FormInput = style('div', {
  border: '1px solid #808080',
  display: 'flex',
  borderRadius: '20px',
  padding: '5px',
  paddingLeft: '10px',
  margin: '5px',
  minHeight: '13px',
})
const SubmitButton = style('button', {
  display: 'block',
  borderRadius: '20px',
  color: 'white',
  backgroundColor: '#18A0FB',
  padding: '10px',
  paddingLeft: '15px',
  paddingRight: '15px',
  marginLeft: 'auto',
  marginRight: 'auto',
  cursor: 'pointer',
})
const LabelText = style('h1', { fontSize: '0.9em', letterSpacing: '1.25px' })
const HeaderLabelText = style('h1', { fontSize: '1.2em', letterSpacing: '1.25px' })
const FormText = style('p', { fontSize: '0.9em', color: 'black', resize: 'none', width: '100%' })

const Home = style('div', 'flex', {
  backgroundColor: '#B0C4DE',
  width: '100vw',
  height: '100vh',
  margin: 'none',
  border: 'none',
  display: 'flex',
  justifyContent: 'center',
})

const CatchPhrase = style('div', 'flex-l', {
  fontSize: '1.5rem',
  fontFamily: "'Risque', sans-serif",
  justifyContent: 'center',
  padding: '0.7rem',
  color: '#FFF',
})
