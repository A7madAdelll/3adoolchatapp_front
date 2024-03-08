import "./styles/Chatappstyle.css"
import React, { useState } from 'react';
const Amessage = (probs) => {

    let [showAllLetters,setshowAllLetters]=useState(0)
    


   
    return ( <>
    {probs.msg.didIsendIt?(    <div className="userMsgStyle" >
    {probs.msg.text.length<=600 ?(<div  >{probs.msg.text}</div>):
    
    (
    !showAllLetters ?( <div  >{probs.msg.text.slice(0, 600)} 
    <span style={{color:"blue"}}  onClick={()=>{setshowAllLetters(1-showAllLetters)}}> &nbsp; read more...</span>
    </div>):( <div  >{probs.msg.text} 
    <span style={{color:"blue"}}  onClick={()=>{setshowAllLetters(1-showAllLetters)}}> &nbsp; read less...</span>
    </div>)
   )
    
    }
        <div style={{float:"right"}}>{probs.msg.time}</div>
    </div>):
    (    <div className="adminMsgStyle" >
    {probs.msg.text.length<=600 ?(<div  >{probs.msg.text}</div>):
    
    (
    !showAllLetters ?( <div >{probs.msg.text.slice(0, 600)} 
    <span style={{color:"blue"}}  onClick={()=>{setshowAllLetters(1-showAllLetters)}}> &nbsp; read more...</span>
    </div>):( <div  >{probs.msg.text} 
    <span style={{color:"blue"}}  onClick={()=>{setshowAllLetters(1-showAllLetters)}}> &nbsp; read less...</span>
    </div>)
   )
    
    }
        <div style={{float:"right"}}>{probs.msg.time}</div>
    </div>)
}






    </> );
}
 
export default Amessage;