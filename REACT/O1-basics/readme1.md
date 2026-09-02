in this folder i have revised all mine react basics and fundamentals how things works in React


const [usersData, setUsersData] = useState([]) ;
  useEffect(()=>{
      getUsersData();
  }, [])
  async function getUsersData() {
    const url = "https://dummyjson.com/users";
    let res = await fetch(url);
    res = await res.json() 
    setUsersData(res.users)

  }
  console.log(usersData)