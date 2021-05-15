/* functions for animations*/

export function aCloseRegister(formRegister){
    formRegister.animate([
        {transform:"scale(1)"},
        {transform:"scale(0) translateY(-700px) rotate(540deg)"}
    ],{
        duration: 1000
    });
}
export function aCloseMessage(message){
    message.animate([
        {bottom:"-100%"}
    ],{
        duration: 1000
    });
}
export function aFormLogin(login){
    login.animate([
        {transform:"rotateY(90deg)"}
    ],{
        duration: 500
    });
    
}