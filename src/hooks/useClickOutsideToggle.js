import { useEffect, useRef, useState }  from 'react'

const useClickOutsideToggle = () => {
    //handling the burger icon
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null)

  useEffect(()=>{
    const handleClickOutSide=(event) =>{
      if (ref.current &&ref.current.contains(event.target)){
        setExpanded(false)
      }
    }

    document.addEventListener("mouseup", handleClickOutSide)
    return () => {
      document.removeEventListener('mouseup', handleClickOutSide)
    }
  }, [ref])

  return { expanded, setExpanded, ref}
}

export default useClickOutsideToggle
