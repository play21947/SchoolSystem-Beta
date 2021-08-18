import Axios from 'axios'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { useHistory } from 'react-router-dom'

const Register = () => {


    let history = useHistory()

    let [isLoadding, setIsLoadding] = useState(false)

    let getUsername
    let getPassword
    let getCfpassword

    let HandleSubmit = (e) => {
        e.preventDefault()

        setIsLoadding(true)

        let username = getUsername.value
        let password = getPassword.value
        let cfPassword = getCfpassword.value

        if (!username || !password || !cfPassword) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                showConfirmButton: false,
                timer: 1500
            })
            setIsLoadding(false)
        }
        else {
            if (password === cfPassword) {
                Axios.post("http://play2lover.ddns.net:3001/register", {
                    username: username,
                    password: password,
                    cfpassword: cfPassword
                }).then((res) => {
                    console.log(res.data)
                    setTimeout(() => {
                        if (res.data.Register) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'สมัครสมาชิกสำเร็จ',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setIsLoadding(false)
                            setTimeout(()=>{
                                localStorage.setItem('username', username)
                                history.push("/")
                                window.location.reload(true)
                            }, 1500)
                        }
                        else {
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                title: 'มีบัญชีนี้อยู่เเล้ว',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setIsLoadding(false)
                        }
                    }, 2000)
                })
            }
            else{
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'รหัสผ่านไม่ตรงกัน',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsLoadding(false)
            }
        }
    }

    console.log(isLoadding)

    return (
        <div className="landing">
            <div className="form-register">
                <h1>สมัครสมาชิก</h1><br />
                <hr />
                <form onSubmit={HandleSubmit}>
                    <p>ชื่อผู้ใช้</p>
                    <input ref={(username) => getUsername = username} placeholder="27181"></input>
                    <div className="flex-pass">
                        <div>
                            <p>รหัสผ่าน</p>
                            <input ref={(password) => getPassword = password} type="password" className="pass-register"></input>
                        </div>
                        <div>
                            <p>ยืนยันรหัสผ่าน</p>
                            <input ref={(cfpassword) => getCfpassword = cfpassword} type="password" className="pass-register"></input>
                        </div>
                    </div>
                    <div className="flex-btn">
                        {isLoadding ? <button disabled>กำลังสมัครสมาชิก...</button> : <button type="submit">สมัครสมาชิก</button>}
                        <button onClick={()=>{
                            history.push("/")
                        }}>กลับ</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register