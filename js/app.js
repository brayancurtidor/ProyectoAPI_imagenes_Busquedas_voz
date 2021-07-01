const resultado=document.querySelector('#resultado');
const formulario=document.querySelector('#formulario');
const pafinaciondiv=document.querySelector('#paginacion');
let mensajeGabacionGlobal='';
let  totalpaginas;
let iterador;
let paginaactual=1;//1 por qur cada vez que hagamos una consulta en l aapi siempre vamos a empezar desde la 1

const registroporpagina=40;
const salida=document.querySelector('#salida');
const microfono=document.querySelector('#microfono');

microfono.addEventListener('click',ejecutarSpeechAPI);
window.onload=()=>{
    formulario.addEventListener('submit',validarformulario);
   
}

function validarformulario(e)
{
    e.preventDefault();
    let terminobusqueda=document.querySelector('#termino').value;
    console.log(mensajeGabacionGlobal)

    if(terminobusqueda===''&& mensajeGabacionGlobal==='')
    {
        MostrarALertas('elige un termino de busqueda o tambien prueba hacer una busqueda por voz');
        return;
    }
    if(mensajeGabacionGlobal!=='')
    {
        terminobusqueda=mensajeGabacionGlobal;
        mensajeGabacionGlobal='';
        
    
    }
    console.log(`Busqueda  final: ${terminobusqueda}`)
    buscarimagenes();

}
function buscarimagenes()
{
    let terminobusqueda=document.querySelector('#termino').value;
    if(mensajeGabacionGlobal!=='')
    {
        terminobusqueda=mensajeGabacionGlobal;
        mensajeGabacionGlobal='';
        
    
    }


    const key="22318566-33dc9d7a1c634684b221ec9dd";
    const url=`https://pixabay.com/api/?key=${key}&q=${terminobusqueda}&per_page=${registroporpagina}&page=${paginaactual}`;
    //console.log(url); muestra el los resultados que da el servicio
    fetch(url)
    .then(respuesta=> respuesta.json())
    .then(datos=>{
         totalpaginas=calcularpaginas(datos.totalHits)
        console.log(totalpaginas)
        MostrarImagenes(datos.hits); 
        
    })

}

//generador que va a registrar la cantidad de elemento sde acuerdo a las paginas
function *crearpaginador(total)
{
    for(let i=1;i<=total;i++)
    {
       yield i;
    }

}

function calcularpaginas(total)
{
 return parseInt(Math.ceil(total/registroporpagina));
}



function MostrarImagenes(imagens)
{
    console.log(imagens)
    //**********limpiar de una vez para no crear funciones */
    while(resultado.firstChild)
    {
        resultado.removeChild(resultado.firstChild);
    }
     //iterar sobre el arreglo de imagenes y construirr el html
    imagens.forEach(imagenforEach => {
        const {largeImageURL,views,likes,downloads}=imagenforEach;
        resultado.innerHTML+=`
        
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-black text-white">
                <img class="w-full" src="${largeImageURL}">
                <div class="p-4">
                    <p><span><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="red" viewBox="0 0 24 24" stroke="red"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg><strong class="font-bold">${likes}</strong></span></p>
                    <p><span><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="blue"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /> </svg><strong class="font-bold">${views}</strong></span></p>
                    <p><span><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="orange">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg><strong class="font-bold">${downloads}</strong></span></p>


                    </div>
            </div>
        </div>
        `;
        
    });
    while(pafinaciondiv.firstChild)
    {
        pafinaciondiv.removeChild(pafinaciondiv.firstChild)
    }
    //despues de limpiar se genera el nuevo html
    imprimirPaginador();

}
function ejecutarSpeechAPI()
{
    const speeachrecognition=webkitSpeechRecognition;
    const recognition=new speeachrecognition();

    recognition.start(); 
    recognition.onstart=function(){ //empeiza a grabar y se almacena en memoria
        salida.classList.add('mostrar')
        salida.textContent='Escuchando';
    };


    recognition.onspeechend =function(){ //cuando terminemos de hablar
        salida.textContent='Se dejo de grabar';
        recognition.stop();
    }
    recognition.onresult=function(e)
    {
        console.log(e.results[0][0])
        const{confidence,transcript}=e.results[0][0];
        capturarMensajeVoz(transcript);
        let terminobusqueda=document.querySelector('#termino');
        terminobusqueda.value=transcript;
        

    }

}
function capturarMensajeVoz(mensaje)
{
    mensajeGabacionGlobal=mensaje;
    return mensajeGabacionGlobal;
    
}
function MostrarALertas(mensaje,tipo)
{
    const existealerta=document.querySelector('.alertas');
    if(!existealerta)
    {
        const alerta=document.createElement('p');
        alerta.classList.add('bg-red-100','alertas','border-red-400','text-red-700','px-4','max-w-lg','mx-auto','mt-6','text-center');
        alerta.innerHTML=`<strong class="font-bold ">Error!!!  </strong><span class="block sm:inline">${mensaje}</span>`;
        formulario.appendChild(alerta);
    
        setTimeout(() => {
    
            alerta.remove();
        }, 4000);

    }
   
}
function imprimirPaginador()
{
     //mostra el total de paginas en numeros
     iterador=crearpaginador(totalpaginas);
    while(true) //hacer que el iterador se ejecute solito con el netx
    {   
        const {value,done}=iterador.next(); 
        if(done) return; //si ya llegamos al final que ya no se ejecute nada
        //caso contrario genrar un boton por cada elemento del generador
        const botn=document.createElement('a')
        botn.href='#'; //numeroal porque no no sllevara a ninguna pagina, pero si a un paginador
        botn.dataset.pagina=value;
        botn.textContent=value;
        botn.classList.add('siguiente','bg-gray-500','px-4','py-1','mr-2','font-bold','mb-4','uppercase','rounded');
        botn.onclick=()=>
        {
            paginaactual=value;
           buscarimagenes();
        }
        pafinaciondiv.appendChild(botn);
    }
}