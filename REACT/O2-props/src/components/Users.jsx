

export const Users = (props) => {
    
  return(
    <div>
        <ul>
            {props.data.map((user)=>(
                <li key={user.id}>
                    {user.firstName} {user.lastName} 
                </li>
            ))}
        </ul>
    </div>
  )
  
}
export default Users
