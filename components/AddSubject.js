import axios from "axios"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { useHistory } from "react-router-dom"

const AddSubject = () => {

    let history = useHistory()

    let getName
    let getAmount
    let getCf
    let getImg

    let [UserData, setUserData] = useState([])

    let username = localStorage.getItem('username')

    if (!username || UserData.length > 0 && UserData[0].role != 1) {
        history.push('/')
    }

    useEffect(() => {
        axios.post('http://play2lover.ddns.net:3001/get_users', {
            username: username
        }).then((res) => {
            setUserData(res.data)
        })
    }, [])

    let HandleSubmit = (e) => {
        e.preventDefault()

        let name = getName.value
        let amount = getAmount.value
        let cf = getCf.value
        let img = getImg.value

        if (!name || !amount || !cf) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                showConfirmButton: false,
                timer: 1500
            })
        }
        else {
            if (cf === "ยืนยัน") {
                axios.post("http://play2lover.ddns.net:3001/addsubject", {
                    name: name,
                    amount: amount,
                    id: UserData[0].id,
                    img: img
                }).then((res) => {
                    console.log(res.data)
                    if(res.data){
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'สร้างชุมนุมสำเร็จ',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        getName.value = ''
                        getAmount.value = ''
                        getCf.value = ''
                        getImg.value = ''
                        setTimeout(()=>{
                            history.push("/choose")
                        }, 2000)
                    }
                })
            }
            else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'รหัสยืนยันไม่ถูกต้อง',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    }

    return (
        <div className="addsubject">
            <div>
                <h1>เพิ่มชุมนุม (Add Subject)</h1>
                <hr />
                <form onSubmit={HandleSubmit}>
                    <p>ชื่อชุมนุม</p>
                    <input ref={(name) => getName = name}></input>
                    <p>รับนักเรียน(คน)</p>
                    <input ref={(amount) => getAmount = amount}></input>
                    <p>รูปภาพ *ถ้ามี</p>
                    <input ref={(img) => getImg = img}></input>
                    <p>ยืนยัน (พิมพ์คำว่า "ยืนยัน" เพื่อสร้างชุมนุม)</p>
                    <input ref={(cf) => getCf = cf}></input><br />
                    {UserData.length > 0 && UserData[0].create_current ? <button className="btn" disabled type="submit">คุณได้สร้างชุมนุมของคุณไปเเล้ว</button> : <button className="btn-add" type="submit">สร้างชุมนุม</button>}
                </form>
            </div>
        </div>
    )
}

export default AddSubject