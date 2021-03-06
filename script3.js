import http from 'k6/http'
import { check, sleep } from 'k6'
import { Counter, Rate } from 'k6/metrics'
export let errorRate = new Rate('errors');
export const options = {
  scenarios: {
    sell: {
      // executor: 'ramping-vus',
      executor: 'per-vu-iterations',
      exec: 'sell',
      // startVUs: 0,
      vus: 2000,
      iterations: 1,
      startTime: '0s',
      maxDuration: '20s',
      // stages: [
      //   // { duration: '20s', target: 500 },
      //   // { duration: '10s', target: 1000 },
      //   // { duration: '10s', target: 1500 },
      //   // { duration: '10s', target: 2000 },
      //   // { duration: '60s', target: 3000 },
      //   // { duration: '15s', target: 0 },
      // ],
      // gracefulRampDown: '0s',
    },
  },
}

export default function() {
  sell()
}

export function sell() {
  http.get('http://localhost:3000/app/selling')
}

const count200 = new Counter('status_code_2xx')
const count300 = new Counter('status_code_3xx')
const count400 = new Counter('status_code_4xx')
const count500 = new Counter('status_code_5xx')

const rate200 = new Rate('rate_status_code_2xx')
const rate300 = new Rate('rate_status_code_3xx')
const rate400 = new Rate('rate_status_code_4xx')
const rate500 = new Rate('rate_status_code_5xx')

function recordRates(res) {
  if (res.status >= 200 && res.status < 300) {
    count200.add(1)
    rate200.add(1)
  } else if (res.status >= 300 && res.status < 400) {
    console.log(res.body)
    count300.add(1)
    rate300.add(1)
  } else if (res.status >= 400 && res.status < 500) {
    count400.add(1)
    rate400.add(1)
  } else if (res.status >= 500 && res.status < 600) {
    count500.add(1)
    rate500.add(1)
  }
}