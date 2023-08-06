import logoImg from '../../assets/logo.svg'
import { Container } from '../../components/container'
import {  Link, useNavigate } from 'react-router-dom'

import { Input } from '../../components/input'
import { useForm } from 'react-hook-form' 
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Register } from '../register'

import { auth } from '../../services/firebaseConnection'
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const schema = z.object({
    name:z.string().nonempty("O campo nome é Obrigatorio"),
    email:z.string().email("Insira um Email Válido").nonempty("O campo email é obrigatorio"),
    password: z.string().min(6,"A senha deve ser maior que 8 caracteres").nonempty("O campo senha é obrigatório")
})
type FormData = z.infer<typeof schema>

export function Register(){
    const { handleInfoUser } = useContext(AuthContext);
    const navidate = useNavigate()


    const { register, handleSubmit, formState: { erros } } = useFrom<FormData>({
        resolver:zodResolver(schema),
        mode: "onChange"
    })

    useEffect(()=>{
        async function handleLogout(){
            await signOut(auth);
        }

        handleLogout()
    },[])

     async function onSubmit(data: FormData){
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (user)=>{
            await updateProfile(user.user,{
                displayName: data.name
            

            })
            handleInfoUser({
                name: data.name,
                emeil: data.email,
                uid: data.user.uid
            })
            navidate("/dashboard", { replace: true })
            
        })
        .catch((error) =>{
            console.log(error)
        })
    }

    return(
        <Container>
            <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4'>
            <Link to='/' className='mb-6 max-w-sm w-full'
            >
                <img src={logoImg} alt="logo do site" />
            </Link>

            <form action="" className='bg-white max-w-xl w-full rounded-lg p-4'
            onSubmit={handleSubmit(onsubmit)}
            >
                
                <div className='mb-3'>
                <Input
                type='email' 
                placeholder="Digite seu Nome completo.."
                name='name'
                error={errors.email?.message}
                register={register}
                />
                </div>

                <div className='mb-3'>
                <Input
                type='email' 
                placeholder="Digite seu Nome completo.."
                name='name'
                error={error.email?.message}
                register={register}
                />
                </div>

                <div className='mb-3'>
                <Input
                type='password' 
                placeholder="Digite sua senha"
                name='password'
                error={errors.email?.message}
                register={register}
                />
                </div>

                <button
                type='submit'
                className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium">
                  Cadastrar
                </button>

            </form>

            <Link to='/login'>
                Já possui uma conta? Faça o Login!!
            </Link>

            </div>
        </Container>
    )
}