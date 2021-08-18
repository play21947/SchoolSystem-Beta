import Axios from 'axios'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'

const Login = () => {

    let history = useHistory()

    let [StatusEye, setStatusEye] = useState(false)
    let [text, setText] = useState('password')

    let username = localStorage.getItem('username')

    if (username) {
        history.push('/choose')
    }


    let onChangeEye=(bool)=>{
        if(!bool){
            setStatusEye(true)
            setText('text')
        }
        else{
            setStatusEye(false)
            setText('password')
        }
    }

    console.log(StatusEye)


    let getUsername
    let getPassword

    let [loginStatus, setLoginStatus] = useState(false)

    let handleSubmit = (e) => {
        e.preventDefault()

        let username = getUsername.value
        let password = getPassword.value

        if (!username || !password) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            setLoginStatus(true)
            setTimeout(() => {
                Axios.post("http://play2lover.ddns.net:3001/login", {
                    username: username,
                    password: password
                }).then((res) => {
                    if (res.data.Login) {
                        console.log(res.data)
                        localStorage.setItem('username', res.data.rs[0].username)
                        setLoginStatus(false)
                        history.push('/choose')
                        setTimeout(()=>{
                            window.location.reload(true)
                        }, 1000)
                    }
                    else {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'เข้าสู่ระบบล้มเหลว',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setLoginStatus(false)
                    }
                })
            }, 2000)
        }
    }

    return (
        <div className="landing">
            <div className="form-register">
                <h1>เข้าสู่ระบบ</h1><br />
                <hr />
                <form onSubmit={handleSubmit}>
                    <p>ชื่อผู้ใช้</p>
                    <input ref={(username) => getUsername = username}></input>
                    <p>รหัสผ่าน</p>
                    <input type={text} ref={(password) => getPassword = password}></input>
                    {!StatusEye ? <img style={{cursor: 'pointer'}} onClick={()=> onChangeEye(StatusEye)} src='https://image.flaticon.com/icons/png/512/876/876769.png'></img> : <img style={{cursor: 'pointer'}} onClick={()=> onChangeEye(StatusEye)} src='https://image.flaticon.com/icons/png/512/159/159604.png'></img>}
                    <div className="flex-btn">
                        {loginStatus ? <button type="submit">กำลังเข้าสู่ระบบ...</button> : <button type="submit">เข้าสู่ระบบ</button>}
                        <button onClick={()=>{
                            history.push('/register')
                        }}>สมัครสมาชิก</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login