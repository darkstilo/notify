const socket = io();


socket.on('message', data => {
    outputMessage(data);
    console.log(data.motorista)
    console.log('Verificação socket online.')
})

var audio = new Audio('sound.mp3');


function outputMessage(t) {
    if (t !== undefined){
        console.log('Não é undefined.')

        //document.getElementById("hide").setAttribute("id", "show");
        var element = document.getElementById("myDiv");
        element.classList.remove("hideDiv");
        element.classList.add("showDiv");

        audio.play();

        document.getElementById("motorista").innerText = t.motorista;
        document.getElementById("origem").innerText = t.origem;
        document.getElementById("destino").innerText = t.destino;
        document.getElementById("distancia").innerText = t.distancia;

        timer=setTimeout(function(){
            hideAlertBox();
        },6000)

        timer=setTimeout(function(){
            hideDiv();
        },7500)

        function hideAlertBox(){
            alertBox.classList.remove("show");
            alertBox.classList.add("hide");
        }

        function hideDiv(){
            element.classList.remove("showDiv");
            element.classList.add("hideDiv");
        }
    }
}
