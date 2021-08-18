import Axios from 'axios'
import { useEffect, useState } from "react"
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'

const Choose = () => {


    let [sjData, setSjData] = useState([])
    let [userData, setUserData] = useState(null)

    let history = useHistory()

    let username = localStorage.getItem('username')
    let itemSearch
    let [Search, setSearch] = useState('')

    if(!username){
        history.push('/')
    }


    useEffect(() => {
        Axios.post('http://play2lover.ddns.net:3001/get_users', {
            username: username
        }).then((res) => {
            setUserData(res.data)
        })
        Axios.get('http://play2lover.ddns.net:3001/get_subject').then((res) => {
            setSjData(res.data)
        })
    }, [])

    if (sjData && sjData.length > 0) {
        itemSearch = sjData.filter((item) => {
            return item.subject_name.includes(Search)
        })
    }

    console.log("UserData", userData)

    let onEnroll = (item) => {
        Axios.post("http://play2lover.ddns.net:3001/enroll", {
            username: username,
            subject: item
        }).then((res) => {
            if (res.data.Success) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'ลงทะเบียนชุมนุมสำเร็จ',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(()=>{
                    window.location.reload(true)
                }, 2000)
            }
            else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'ลงทะเบียนชุมนุมล้มเหลว',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })
    }


    return (
        <div>
            <div className="search">
                <input value={Search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหา"></input>
                <img src="https://image.flaticon.com/icons/png/512/709/709592.png"></img>
                {Search ? <p onClick={()=> setSearch('')} className="delete">X</p> : null}
            </div>
            <div className="choose">
                <div className="flex-choose">
                    {sjData.length > 0 && sjData ? itemSearch.map((item) => {
                        return (
                            <div className="box-sj">
                                <div className="box-flex">
                                    <div>
                                        <p>{item.subject_name}</p>
                                    </div>
                                    <div>
                                        <p>{item.subject_max}/{item.subject_current}</p>
                                    </div>
                                </div><br />
                                <hr /><br />
                                <img src={item.subject_img}></img>
                                {userData && userData[0].activity ? <button className="btn-already" disabled onClick={() => onEnroll(item.id)}>คุณได้ลงชุมนุมไปเเล้ว</button> : item.subject_current >= item.subject_max ? <button className="btn-already" disabled onClick={() => onEnroll(item.id)}>ชุมนุมนี้เต็มเเล้ว</button> : <button className="btn-ready" onClick={() => onEnroll(item.id)}>ลงชุมนุม</button>}
                            </div>
                        )
                    }) : null}
                </div>
            </div>
        </div>
    )
}

export default Choose