import { useState, useEffect } from "react"
import { Container } from "../../components/container"
import {FaWhatsapp} from 'react-icons/fi'
import { useNavigate, useParams } from "react-router-dom"
import { getDoc, doc } from 'firebase/firestore'
import { db } from "../../services/firebaseConnection"

import { Swiper, SwiperSlade } from 'swiper/react'

interface CarProps{
    id: string;
    name: string;
    model: string;
    city: string;
    year: string;
    km: string;
    description: string;
    created: string;
    price: string | number;
    owner: string;
    uid: string;
    whatsapp: string
    images:

}
interface ImagesCarProps{
 uid:string;
 name: string;
 url: string;
}

export function CarDetail(){
    const { id } = useParams();
    const [car, setCar] = useState<CarProps[]>()
    const [sliderPerview, setSlidePerview] = useState<number>(2)
    const navigate = useNavigate()

    useEffect(()=>{
        async function loadCar(){
            if(!id){return}

            const docRef = doc(db, "cars", id)
            getDoc(docRef)
            .then((snapshot) => {

                if(!snapshot.data()){
                    navidate("/")
                }

                setCar({
                    id: snapshot.id,
                    name: snapshot.data()?.name
                    year: snapshot.data()?.year,
                    city: snapshot.data()?.city,
                    model: snapshot.data().model,
                    uid: snapshot.data()?.uid,
                    description: snapshot.data()?.description,
                    created: snapshot.data()?.created,
                    whatsapp: snapshot.data()?.whatsapp,
                    price: snapshot.data()?.price,
                    km: snapshot.data()?.km,
                    owner: snapshot.data()?.owner,
                    images: snapshot.data()?.images
                })
            })
        }
    })

    useEffect(()=>{

        function handleResize(){
            if(window.innerWidth < 720){
                setSlidePerview(1);
            }else{
                setSlidePerview(2)
            }
        }

        handleResize();

        window.addEventListener("resize", handleResize)

        return()=>{
            window.removeEventListener("resize", handleResize)
        }
    })

    return(
        <Container>
           
            {car && (
                <Swiper
                sliderPerview={sliderPerview}
                pagination={{clickable: true}}
                navigation
            >
                {car?.images.map( image => (
                    <SwiperSlade key={image.name}>
                        <img
                        src={image.url}
                        className="w-full h-96 object-cover"
                        />
                    </SwiperSlade>
                ))}
            </Swiper>

            )}

            { car && (
                <main className="w-full bg-white rounded-lg p-6 my-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row mb-4">
                    <h1 className="font-bold text-3x1 text-black">{car?.name}</h1>    
                    <h1 className="font-bold text-3x1 text-black">R${car?.price}</h1>
                    </div>
                    <p>{car?.model}</p>

                    <div className="flex w-full gap-6 my-4">
                        <div className="flex flex-col gap-4">
                        <div>
                            <p>Cidade</p>
                            <strong>{car?.city}</strong>
                        </div>
                        <div>
                            <p>Ano</p>
                            <strong>{car?.year}</strong>
                        </div>
                        </div>

                        <div className="flex flex-col gap-4">
                        <div>
                            <p>Km</p>
                            <strong>{car?.km}</strong>
                        </div>
                        </div>
                    </div>

                    <strong>Descricao</strong>
                    <p className="mb-4">{car?.description}</p>

                    <strong>Telefone / WhatsaApp</strong>
                    <p>{car?.whtsapp}</p>

                    <a
                    target="_blank"
                    href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá vi esse ${car?.name} e fiquei interessado`} className="cursur-pointer bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-x1 rounded-lg font-bold">
                        Converse com vendedor
                        <FiWhatsapp size={26} color='#fff'/>
                    </a>
                </main>
                
            )}
        </Container>
    )
}