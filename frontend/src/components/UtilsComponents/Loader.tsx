import { PiSpinner } from 'react-icons/pi'

const Loader = ({text,size}:{text:string,size:number  | null}) => {
  return (
    <div className='flex items-center justify-center flex-col'>
        <PiSpinner className='animate-spin' size={size ?? undefined}/>
        <p>{text}</p>
    </div>
  )
}

export default Loader