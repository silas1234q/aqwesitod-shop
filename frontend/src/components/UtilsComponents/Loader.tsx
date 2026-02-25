import { PiSpinner } from 'react-icons/pi'

const Loader = ({text}:{text:string}) => {
  return (
    <div className='flex items-center justify-center flex-col'>
        <PiSpinner className='animate-spin' size={30}/>
        <p>{text}...</p>
    </div>
  )
}

export default Loader