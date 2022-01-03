// const Http = new XMLHttpRequest();
// const url='https://jsonplaceholder.typicode.com/posts';
// Http.open("GET", url);
// Http.send();

// Http.onreadystatechange = function() {
//     if(this.readyState == 4 && this.status == 200){
//         console.log(Http.responseText)
//     }
// }

// $(document).ready(function(){
//     const Url = 'https://jsonplaceholder.typicode.com/posts';
//     $('.btn').click(function(){
//         $.ajax({
//             url: Url,
//             type: "GET",
//             success: function(result){
//                 console.log(result)
//             },
//             error: function(error){
//                 console.log('Error ${error}')
//             }
//         })
//     })
// })

$('.btn').click(function(){
        prompt("hello")
        console.log(httpGet())
})

function httpGet()
{
    var XMLHttpRequest = require('xhr2');
    var xmlHttp = new XMLHttpRequest();
    const Url = 'https://jsonplaceholder.typicode.com/posts';
    xmlHttp.open( "GET", Url, false ); // false for synchronous request
    xmlHttp.send( null );
    var shady = xmlHttp.responseText;
    return shady;
}
