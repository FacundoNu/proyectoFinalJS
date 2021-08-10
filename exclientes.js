$(function(){
    $('#exClientes').click((e) =>  {
        $.ajax({
            method: "GET",
            url: "http://localhost:3000/clientes",
            success: function(clientes){
                for (let cliente of clientes){
                    $('#tabla2>tbody').append(`<tr id="${cliente.id}">
                        <td>${cliente.id}</td>
                        <td>${cliente.nombre}</td>
                        <td>${cliente.apellido}</td>
                        <td>${cliente.edad}</td>
                        <td>${cliente.genero}</td>
                        </tr>
                        `);
                }
            }
        })
    });
})