// ==UserScript==
// @name         MeetAcessib
// @namespace    https://github.com/jeimison3/MeetAcessib
// @version      0.1.0
// @description  Ferramentas assistivas para Google Meet
// @author       jeimison3
// @match        http://meet.google.com/*
// @match        https://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=meet.google.com
// @downloadURL  https://github.com/jeimison3/MeetAcessib/raw//MeetAcessib.user.js
// @grant        none
// ==/UserScript==

'use strict';

const atalhoAceitar = {ctrl:true, key:'a'}
const atalhoGravar = {ctrl:true, key:'g'}


var globalScriptOn = {permitirEntrada:true, gravando:false, iniciandoGravacao:false, parandoGravacao: false};

document.addEventListener('DOMNodeInserted', function(a) {
    if(globalScriptOn.permitirEntrada){
        if(existeBtn("Permitir")) ordemClicks("Permitir")
        if(existeBtn("Ver tudo")) ordemClicks("Ver tudo>Permitir todos")
    } else {
        if(existeBtn("Negar")) ordemClicks("Negar")
        if(existeBtn("Negar todos")) ordemClicks("Negar todos")
    }
})

// Keys:
document.addEventListener('keydown', (ev) => {
    if(ev.key.toLowerCase() == atalhoAceitar.key && ev.ctrlKey == atalhoAceitar.ctrl){
        createQuest({
            opEsq:{texto:'R', click:()=>{
                globalScriptOn.permitirEntrada = false
                console.log("ScriptOn> RECUSAR TODOS")
            }},
            opDir:{texto:'A', click:()=>{
                globalScriptOn.permitirEntrada = true
                console.log("ScriptOn> ACEITAR TODOS")
            }}
        })

    } else if (ev.key.toLowerCase() == atalhoGravar.key && ev.ctrlKey == atalhoGravar.ctrl){
        createQuest({
            opEsq:{texto:'P', click:()=>{
                console.log("ScriptOn> PARAR GRAVAÇÃO")
                pararGravacao()
            }},
            opDir:{texto:'G', click:()=>{
                console.log("ScriptOn> INICIAR GRAVAÇÃO")
                iniciarGravacao()
            }}
        })
    }
})

// "Gravar reunião" -> "Começar a gravar" -> "Iniciar"
// "Interromper gravação" -> "Interromper gravação"

const iniciarGravacao = ()=>{
    globalScriptOn.iniciandoGravacao = true
    let ordem = "more_vert>Gravar reunião>Começar a gravar>Iniciar>close"
    ordemClicks(ordem).catch(()=>{
        clickBtn("close")
        ordemClicks(ordem)
    })
    aoSurgirHardcore("OK").then((r)=>{
        if(r)
            clickBtnHardcore("OK")
    })
    aoSurgir("Ignorar").then((r)=>{
        if(r)
            clickBtn("Ignorar")
    })
}

const pararGravacao = ()=>{
    globalScriptOn.parandoGravacao = true
    let ordem = "more_vert>Interromper gravação>Interromper gravação>close"
    ordemClicks(ordem).catch(()=>{
        clickBtn("close")
        ordemClicks(ordem)
    })
}

// Diálogos não visíveis por innerText mas por innerHTML

const clickBtnHardcore = (name) =>{
    document.querySelectorAll('[jsaction]').forEach((v)=>{
        if(v.innerHTML)
            if(v.innerHTML.indexOf(name))
                v.click()
    });
}

const existeBtnHardcore = (name) =>{
    let encontrou = false;
    document.querySelectorAll('[jsaction]').forEach((v)=>{
        if(v.innerHTML)
            if(v.innerHTML.indexOf(name))
                encontrou = true
    })
    return encontrou;
}

const aoSurgirHardcore = async (name) => {
    let contador = 50
    while(contador--){
        await new Promise(r=>setTimeout(()=>r(), 100))
        if(existeBtnHardcore(nome))
            return true
    }
    return false
}

//

const aoSurgir = async (name) => {
    let contador = 50
    while(contador--){
        await new Promise(r=>setTimeout(()=>r(), 100))
        if(existeBtn(nome))
            return true
    }
    return false
}

const clickBtn = (name, elemento = document) =>{
    elemento.querySelectorAll('[jsaction]').forEach((v)=>{
        if([name].includes(v.innerText)){
            v.click();
        }
    });
}

const existeBtn = (name, elemento = document) =>{
    let encontrou = false;
    elemento.querySelectorAll('[jsaction]').forEach((v)=>{
        if(name == v.innerText){
            encontrou = true;
        }
    })
    return encontrou;
}

const ordemClicks = async(ordem) =>{
    const clicks = ordem.split(">")
    const intervalo = 300 //ms
    const retries = 5
    for(let btn of clicks) {
        aoSurgir(btn).then(r=>{
            if(r)
                clickBtn(btn)
            else{

            }
        })
        clickBtn(btn)
    }
}

const createQuest = (formato) => {
    let tela = document.createElement("div")
    tela.style.textAlign="center"
    tela.style.position="fixed"
    tela.style.background="black"
    tela.style.top=0
    tela.style.left=0
    tela.style.height="100%"
    tela.style.width="100%"
    tela.style.zIndex="1"

    let textoRecusar = document.createElement("div")
    textoRecusar.innerText = formato.opEsq.texto
    textoRecusar.style.fontSize = "43vw"
    textoRecusar.style.color = "white"
    textoRecusar.style.width="50%"
    textoRecusar.style.height="100%"
    textoRecusar.style.float="left"
    textoRecusar.onmousemove = ()=>{ textoRecusar.style.backgroundColor="white"; textoRecusar.style.color="black"; textoRecusar.style.fontSize = "48vw" }
    textoRecusar.onmouseleave = ()=>{ textoRecusar.style.backgroundColor="black"; textoRecusar.style.color="white"; textoRecusar.style.fontSize = "36vw" }
    textoRecusar.onclick = ()=>{tela.remove();formato.opEsq.click()}
    tela.appendChild(textoRecusar)

    let textoAceitar = document.createElement("div")
    textoAceitar.innerText = formato.opDir.texto
    textoAceitar.style.fontSize = "45vw"
    textoAceitar.style.color = "white"
    textoAceitar.style.width="50%"
    textoAceitar.style.height="100%"
    textoAceitar.style.float="right"
    textoAceitar.style.textAlign="center"
    textoAceitar.onmousemove = ()=>{ textoAceitar.style.backgroundColor="white"; textoAceitar.style.color="black"; textoAceitar.style.fontSize = "48vw" }
    textoAceitar.onmouseleave = ()=>{ textoAceitar.style.backgroundColor="black"; textoAceitar.style.color="white"; textoAceitar.style.fontSize = "36vw" }
    textoAceitar.onclick = ()=>{tela.remove(); formato.opDir.click()}
    tela.appendChild(textoAceitar)

    document.body.appendChild(tela)
}
