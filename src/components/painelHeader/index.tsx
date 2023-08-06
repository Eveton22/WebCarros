import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../services/firebaseConnection'

export function DashdoardHeader(){

    async function handleLogout(){
        await signOut(auth);
    }

    return(
        <di className="w-full items-center flex h-10 bg-red-500 rounded-lg text-white font-medium gap-4 px-4">
            <Link to="/dashboard">
                Dashboard
            </Link>
            <Link to="/dashboard/new">
                Cadastrar carro
            </Link>

            <button className='ml-auto mb-4' onClick={handleLogout}>
                Sair da Conta
            </button>
        </div>
    )
}