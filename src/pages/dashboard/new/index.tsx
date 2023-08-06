import { Container } from "../../../components/container";
import { DashdoardHeader } from "../../../components/painelHeader";
import { FiDownload, FiUpload, FiTrash } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { Input } from '../../../components/input'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../../../components/input";
import { ChangeEvent, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
//import { v4 as uuidV4 } from 'uuid'

import { storage, db } from '../../services/firebaseConnection'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage'
import { addDoc, collection } from 'firebase/firestore'

const schema = z.object({
    name: z.string().nonempty("O campo nome nao pode ser vazio"),
    model: z.string().nonempty("O modelo é obrigatorio"),
    year: z.string().nonempty("O ano do carro é obrigatorio"),
    km: z.string().nonempty("O km no carro é Obrigado"),
    price: z.string().nonempty("O preco do carro é Obrigario"),
    city: z.string().nonempty("A cidade é obrigatoria"),
    whatsapp: z.string().min(1, "O telefone é obrigatorio").refine((value)=> /^(\d{10,12})$/.test(value), {
        massage: "Numero de Telefone Invalido."
    }),
    description: z.string().nonempty("A descricao é obrigatoria")
})

interface ImageItemProps{
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
}
type FormData = z.infer<typeof schema>;

export function New(){
    const { user } = useContext(AuthContext);
    const {register, handleSubmit, formState: {errors}, reset} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    const [carImages, setCarImages] = useState<ImageItemProps[]>([])

    function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files[0]){
            const image = e.target.files[0]

            if(image.type ==== "image/jpeg" || image.type === 'image/png'){
                await handleUpload(image)
            }else{
                alert("Envie uma imagem jpeg ou png!")
                return;
            }
        }
    }

    async function handleUpload(image: File){
        if(!user?.uid){
            return;
        }

        const currentUid = user?.uid;
        const uidImage = uuidV4;

        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

        uploadBytes(uploadRef, image)
        .then((snapshot)=>{
            getDownloadURL(snapshot.ref).then((downloadURL)=>{
                const imageItem = {
                    name: uidImage,
                    uid: currentUid,
                    previenUrl: URL.createObjectURL(image),
                    url: downloadURL,
                }

                setCarImages((images) => [...images, imageItem])

            })
        })


    }

    function onSumit(data: FormData){
        if(carImages.length === 0){
            alert("Envie Alguma imagem desse carro")
            return;
        }

        const carListImages = carImages.map( car => {
            return{
                uid: car.uid,
                name: car.name,
                url: car.url
            }
        })
        
        addDoc(collection(db, 'cars'), {
            name: data.name.toUpperCase(),
            model: data.model,
            whatsapp: data.whatsapp,
            city: data.city,
            year: data.km,
            price: data.price,
            description: data.description
            created: new Date(),
            owner: user?.name,
            uid: user?.uid,
            images: carListImages
        })
        .then(()=>{
            reset();
            setCarImages([]);
            console.log("CADASTRADO COM SUCESSO")
        })
        .catch((error)=>{
            console.log(error)
            consoele.log("ERRO AO CADASTRAR NO BANCO")
        })
    }

    async function handleDeleteImage(item: ImageItemProps){
        const imagePath = `images/${item.uid}/${item.name}`;

        const imageRef = ref(storage, imagePath);

        try{
            await deleteObject(imageRef)
            setCarImages(carImages.filter((car) => car.url !== item.url))
        }catch(err){
            console.log('ERRO AO DELETAR')
        }
    }


    return(
        <Container>
            <DashdoardHeader/>

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center pag-2">
                <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-3">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#000" />
                    </div>
                    <div className="cursor-pointer">
                        <input type="file"  accept="image/*" className="opacity-0 cursor-pointer"
                        onchange={handleFile}/>
                    </div>
                </button>

                {carImages.map(item =>{
                    <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
                        <button className="absolute" onClick={()=> handleDeleteImage(item)}>
                            <FiTrash size={28} color="#fff"/>
                        </button>
                        <img src={item.previewUrl} alt="foto do carro"
                        className="rounded-lg w-full h32 object-cover"
                        />
                    </div>
                })}
            </div>

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                <form action="" className="w-full" onSubmit={handleSubmit(onSubmit)}>
                    
                <div className="mb-3">
                    <p clasName="mb-2">Nome do carro</p>
                    <Input
                    type='text'
                    register={register}
                    name="name"
                    error={errors.name?.message}
                    placeholder="Ex: Onix 1.0..."
                    />
                </div>

                <div className="mb-3">
                    <p clasName="mb-2">Modelo Do carro</p>
                    <Input
                    type='text'
                    register={register}
                    name="model"
                    error={errors.model?.message}
                    placeholder="Ex: flex 1.0 PLUS MANUAL..."
                    />
                </div>

                <div className="flex w-full mb-3 flex-row items-center gap-4">
                <div className="w-full">
                    <p clasName="mb-2">Ano</p>
                    <Input
                    type='text'
                    register={register}
                    name="model"
                    error={errors.year?.message}
                    placeholder="Ex: 2016/2016"
                    />
                </div>

                <div className="w-full">
                    <p clasName="mb-2">Km Rodados</p>
                    <Input
                    type='text'
                    register={register}
                    name="model"
                    error={errors.km?.message}
                    placeholder="Ex: 23.444..."
                    />
                </div>
                </div>

                <div className="flex w-full mb-3 flex-row items-center gap-4">
                <div className="w-full">
                    <p clasName="mb-2">Telefone / Whatsapp</p>
                    <Input
                    type='text'
                    register={register}
                    name="whatsapp"
                    error={errors.whatsapp?.message}
                    placeholder="Ex: 119000-0000"
                    />
                </div>

                <div className="w-full">
                    <p clasName="mb-2">Cidade</p>
                    <Input
                    type='text'
                    register={register}
                    name="model"
                    error={errors.city?.message}
                    placeholder="Ex: São Paulo- SP"
                    />
                </div>
                </div>

                <div className="mb-3">
                    <p clasName="mb-2">Preço</p>
                    <Input
                    type='text'
                    register={register}
                    name="name"
                    error={errors.name?.message}
                    placeholder="Ex: 69.000..."
                    />
                </div>

                <div className="mb-3">
                    <p className="mb-2 font-medium">Descrição</p>
                    <textarea
                        className="border-2 w-full rounded-md h-24 px-2"
                        {...register("description")}
                        name="description"
                        id="description"
                        placaholder="Digite a Descrição completa sobre o carro..."
                        />
                        {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
                </div>

                <button
                type="submit"
                className="w-full rounded-md bg-zinc-900 text-white font-medium h-10"
                >Cadastrar
                </button>

                

                </form>
            </div>

        </Container>
    )
}