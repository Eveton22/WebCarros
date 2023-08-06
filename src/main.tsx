import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './App.tsx'
import './index.css'

import { RouterProvider } from 'react-router-dom'
import AuthProvider from './context/AuthContext.tsx'

import { register } from 'swiper/element/bundle'

register();
import 'swiper/css'
import 'swiper/css/navigate'
import 'swiper/css/pagination'
import 'swiper/css/scroll'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>,
)
