import axios from "axios"
import { useEffect, useState } from "react"

import { useHistory } from "react-router-dom"

const OwnClass = () => {

    let username = localStorage.getItem('username')

    let history = useHistory()

    let [UserData, setUserData] = useState(null)
    let [own, setOwn] = useState(null)
    let [status, setStatus] = useState(false)

    useEffect(() => {
        if(!username){
            history.push('/')
        }
        axios.post('http://play2lover.ddns.net:3001/get_users', {
            username: username
        }).then((res) => {
            setUserData(res.data)
            setStatus(true)
        })
        if (UserData && UserData[0].create_current) {
            axios.post("http://play2lover.ddns.net:3001/ownclass", {
                subject: UserData[0].create_current
            }).then((res) => {
                console.log(res.data)
                setOwn(res.data)
            })
        }
    }, [status])

    return (
        <div className="list-students">
            {UserData && UserData.length > 0 ? <p className="header-subject">ชุมนุม : {UserData[0].create_current}</p> : null}
            {own && own.length > 0 ? <p>มีนักเรียนจำนวน : {own.length} คน</p> : null}
            <div className="grid-list">
                {own && own.length > 0 ? own.map((item, index) => {
                    return (
                        <div className="list-box">
                            <p>- {item.username}<img className="correct" src="https://image.flaticon.com/icons/png/512/5219/5219192.png"></img>ยืนยันเเล้ว</p>
                        </div>
                    )
                }) : <div><p>ยังไม่มีนักเรียนคนใดเข้าชุมนุมของคุณค่ะ</p></div>}
            </div>
        </div>
    )
}

export default OwnClass