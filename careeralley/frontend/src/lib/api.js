const API = "http://localhost:8080"

export const get = async (url, token) => {

  const res = await fetch(API + url,{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })

  return res.json()

}

export const post = async (url,body,token) => {

  const res = await fetch(API + url,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${token}`
    },
    body:JSON.stringify(body)
  })

  return res.json()

}