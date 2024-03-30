import Comments from "ui/comments"

const Tool = (props)=> {
   const {uuid,id}=props

    return  <div className="absolute right-2 top-2"><Comments isRounded uuid={uuid} id={id} /></div>
}

export default Tool