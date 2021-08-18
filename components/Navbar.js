import Axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'

const Navbar = () => {

    let [status, setStatus] = useState(false)
    let [userData, setUserData] = useState(null)

    let history = useHistory()

    let username = localStorage.getItem('username')

    useEffect(() => {
        Axios.post('http://play2lover.ddns.net:3001/get_users', {
            username: username
        }).then((res) => {
            setUserData(res.data)
        })
    }, [])

    let leave = () => {
        Swal.fire({
            text: "ต้องการออกชุมนุม?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ออกจากชุมนุม'
        }).then((result) => {
            if (result.isConfirmed) {
                Axios.post("http://play2lover.ddns.net:3001/leave", {
                    username: username
                }).then((res) => {
                    if (res.data) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'ออกจากชุมนุมเรียบร้อยเเล้ว',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(() => {
                            window.location.reload(true)
                        }, 2000)
                    }
                })
            }
        })
    }

    return (
        <div>
            {!status ? <i onClick={() => {
                if (!status) {
                    setStatus(true)
                }
                else {
                    setStatus(false)
                }
            }} className="fas fa-bars"></i> : null}
            {!status ? null : <div className="nav">
                <div>
                    <Link className="link" onClick={() => {
                        if (!status) {
                            setStatus(true)
                        }
                        else {
                            setStatus(false)
                        }
                    }}><h5 className="x">X</h5></Link>
                    <div className="flex-user m">
                        {username ? userData[0].role == 1 ? <img src="https://image.flaticon.com/icons/png/512/2784/2784488.png"></img> : <img src="https://img-premium.flaticon.com/png/512/2995/premium/2995657.png?token=exp=1629129121~hmac=f58ab8e78769caa9df48a5c2df5d3f03"></img> : <img src="https://image.flaticon.com/icons/png/512/847/847969.png"></img>}
                        <div>
                            {username ? userData[0].role == 1 ? <span>{username} (คุณครู)</span> : <span>{username} (นักเรียน)</span> : <span>Annonymous</span>}<br />
                            {username ? userData[0].activity ? <span className="leave" onClick={() => leave()}>ชุมนุม : {userData[0].activity}</span> : <span>ชุมนุม : ไม่มี</span> : null}
                        </div>
                    </div><br />
                    <hr style={{ color: "black" }} />
                    {username ? null : <Link className="link" to="/" onClick={() => setStatus(false)}><p>เข้าสู่ระบบ</p></Link>}
                    {username ? null : <Link className="link" to="/register" onClick={() => setStatus(false)}><p>สมัครสมาชิก</p></Link>}
                    {username && userData[0].role == 1 ? <Link className="link" to="/ownclass" onClick={() => setStatus(false)}><p>นักเรียนในชุมนุม</p></Link> : null}
                    {!username ? null : <Link className="link" to="/choose" onClick={() => setStatus(false)}><p>ลงทะเบียนชุมนุม</p></Link>}
                    {username && userData[0].role == 1 ? <Link className="link" to="/addsubject" onClick={() => setStatus(false)}><p>เพิ่มชุมนุม</p></Link> : null}
                    {!username ? null : <Link className="link" onClick={() => {
                        Swal.fire({
                            text: "คุณต้องการออกจากระบบ?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: 'firebrick',
                            cancelButtonColor: 'mediumseagreen',
                            confirmButtonText: 'ออกจากระบบ',
                            cancelButtonText: 'ยกเลิก'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                setStatus(false)
                                localStorage.removeItem('username')
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'ออกจากระบบ',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                setTimeout(() => {
                                    history.push("/")
                                }, 2000)
                            }
                        })
                    }}><p>ออกจากระบบ</p></Link>}
                </div>
            </div>}
        </div>
    )
}

export default Navbar