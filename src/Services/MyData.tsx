class userData{
  
    getUsers(params:any) {
        const skip = params.skip;
        const limit = params.limit;
      return fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`)
      .then(res => res.json())
    }

    searchUser(text: String) {
      return fetch(`https://dummyjson.com/users/search?q=${text}`)
      .then(res => res.json())
    }

    addUser(data:any)
    {
        return fetch('https://dummyjson.com/users/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firstName: 'Muhammad',
              lastName: 'Ovi',
              age: 250,
              /* other user data */
            })
          })
          .then(res => res.json())
    }

    deleteUser(id:string)
    {
        return fetch(`https://dummyjson.com/users/${id}`, {
            method: 'DELETE',
          })
          .then(res => res.json())
    }

    updateUser(id:string,data:any)
    {
        return fetch(`https://dummyjson.com/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firstName:data.firstName,
              lastName: data.lastname,
              email: data.email,
              phone: data.phone,
              gender: data.gender,

            })
          })
          .then(res => res.json())
    }

    getUserById(id:string)
    {
        return fetch(`https://dummyjson.com/users/${id}`)
        .then(res => res.json())
    }
  }
  
  export default new userData();
  