import React from 'react'
import { Link } from 'react-router-dom'

function PageNotFound() {
  return (
    <div>
        <h1>Your Page is Not Found</h1>
        <Link to={'/'}>Go Back Home Page</Link>
    </div>
  )
}

export default PageNotFound