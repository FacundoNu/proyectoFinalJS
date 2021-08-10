$(function(){
    let id = 0;
    let idFila = 0;
    let idEdit = 0;
    let clientes = [];
    const nombre = $('#nombre');
    const apellido = $('#apellido');
    const edad = $('#edad');
    const genero = $('#genero');
    const dineroActual = $('#dineroActual');
    const monto = $('#monto');
    


    // En caso de que el usuario ya haya utilizado la página y la actualice, se realiza un cargado de los datos que tenía.
    if(localStorage.getItem("primeraVez") != null){
        id = Number(localStorage.getItem('id'));
        idFila = Number(localStorage.getItem('idFila'));
        clientes = JSON.parse(localStorage.getItem('clientes'));
        for (let cliente of clientes){

            $('#tabla>tbody').append(`<tr id="${cliente.id}">
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.edad}</td>
                <td>${cliente.genero}</td>
                <td>${cliente.dinero}</td>
                <td>
                    <div class="botones">
                        <button class="money" id="dinero"><i class="fas fa-money-check-alt"></i></button>
                        <button class="edit" id="editar"><i class="fas fa-user-edit"></i></button>
                        <button class="delete" id="borrar"><i class="fas fa-user-times"></i></button>
                    </div>
                </td></tr>
                `);
        }
    }




    // En caso de que se aprete el botón "Agregar nuevo cliente".
    $('#agregarNuevo').click((e) =>  {
        $('#ventana').show();
        $('#editarAceptar').hide();
        $('#agregar').show();
        $('#textoEditar').hide();
        $('#textoAgregar').show();
        $('.fondo').show();
        $('#select-form').hide();
        $('#money-form').hide();
        $('#main-form').show();
    });


    // En caso de que se aprete el botón "Aceptar" en el modo "Agregar".
    $('#agregar').click((e) => {
        e.preventDefault();

        if (nombre.val() === '' || apellido.val() === '' || edad.val() === '') {
            $('#error').show();
            return;
        }
        $('#error').hide();
        
        idFila += 1;
        id += 1;
        clientes.push( {id: id, nombre: nombre.val(), apellido: apellido.val(), edad: edad.val(), genero: genero.val(), dinero: 0});
        
        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('delete');
        btnBorrar.setAttribute('id', 'borrar');
        btnBorrar.innerHTML = '<i class="fas fa-user-times"></i>';

        const btnEditar = document.createElement('button');
        btnEditar.classList.add('edit');
        btnEditar.setAttribute('id', 'editar');
        btnEditar.innerHTML = '<i class="fas fa-user-edit"></i>';

        const btnDinero = document.createElement('button');
        btnDinero.classList.add('money');
        btnDinero.setAttribute('id', 'dinero');
        btnDinero.innerHTML = '<i class="fas fa-money-check-alt"></i>';


        
        $('#tabla>tbody').append(`<tr id="${idFila}">
                <td>${nombre.val()}</td>
                <td>${apellido.val()}</td>
                <td>${edad.val()}</td>
                <td>${genero.val()}</td>
                <td>0</td>
                <td>
                    <div class="botones">
                        ${btnDinero.outerHTML}
                        ${btnEditar.outerHTML}
                        ${btnBorrar.outerHTML}
                    </div>
                </td></tr>
                `);

        
        

        $('#ventana').hide();
        $('.fondo').hide();
        $('#textoAgregar').hide();

        // Guardado de información en storage.
        let clientesJSON = JSON.stringify(clientes);
        localStorage.setItem('clientes', clientesJSON);
        localStorage.setItem('idFila', idFila);
        localStorage.setItem('id', id);
        localStorage.setItem('primeraVez', true);
        $('#main-form').trigger("reset");
        

    });

    // En caso de que se aprete el botón "Cancelar" en cualquier modo.
    $('#cancelar').click((e) => {
        e.preventDefault();
        $('.fondo').hide();
        $('#main-form').trigger("reset");
        $('#ventana').hide();
        $('#error').hide();
    });

    // En caso de que se aprete para borrar tal usuario.
    $(document).on('click', '#borrar', function(e) {
        $(`#${e.currentTarget.parentNode.parentNode.parentNode.getAttribute('id')}`).remove()
        for (let cliente of clientes){
            if (cliente.id == e.currentTarget.parentNode.parentNode.parentNode.getAttribute('id')){
                $.ajax({
                    method: "POST",
                    url: "http://localhost:3000/clientes",
                    data: cliente,
                    success: function(){
                        console.log("Hecho")
                    },
                })
                clientes.splice(clientes.indexOf(cliente), 1);
            }
        }

        // Guardado de información en storage.
        let clientesJSON = JSON.stringify(clientes);
        localStorage.setItem('clientes', clientesJSON);
    });

    // En caso de que se aprete para editar tal usuario.
    $(document).on('click', '#editar', function(e) {
        idEdit = e.currentTarget.parentNode.parentNode.parentNode.getAttribute('id');
        let filaEdit = $(`#${idEdit}`);
        $('#ventana').show();
        $('#textoAgregar').hide();
        $('#textoEditar').show();
        $('#agregar').hide();
        $('#editarAceptar').show();
        $('.fondo').show();
        $('#select-form').hide();
        $('#money-form').hide();
        $('#main-form').show();
        nombre.val(filaEdit[0].children[0].innerText); 
        apellido.val(filaEdit[0].children[1].innerText); 
        edad.val(filaEdit[0].children[2].innerText); 
        genero.val(filaEdit[0].children[3].innerText);
        
    });


    // En caso de que se aprete el botón "Aceptar" en el modo "Editar".
    $('#editarAceptar').click((e) => {
        e.preventDefault();

        if (nombre.val() === '' || apellido.val() === '' || edad.val() === '') {
            $('#error').show();
            return;
        }
        $('#error').hide();

        let filaEdit = $(`#${idEdit}`);
        filaEdit[0].children[0].innerText = nombre.val();
        filaEdit[0].children[1].innerText = apellido.val();
        filaEdit[0].children[2].innerText = edad.val();
        filaEdit[0].children[3].innerText = genero.val();


        for (let cliente of clientes){
            if (cliente.id == idEdit){
                clientes[clientes.indexOf(cliente)].nombre = nombre.val();
                clientes[clientes.indexOf(cliente)].apellido = apellido.val();
                clientes[clientes.indexOf(cliente)].edad = edad.val();
                clientes[clientes.indexOf(cliente)].genero = genero.val();
            }
        }


        // Guardado de información en storage.
        let clientesJSON = JSON.stringify(clientes);
        localStorage.setItem('clientes', clientesJSON);
        $('#ventana').hide();
        $('#main-form').trigger("reset");
        $('.fondo').hide();

    });

    // En caso de que se aprete para editar el dinero del usuario.
    $(document).on('click', '#dinero', function(e) {
        idEdit = e.currentTarget.parentNode.parentNode.parentNode.getAttribute('id');
        $('#select-form').show();
        $('#textoAgregar').hide();
        $('#textoEditar').hide();
        $('#ventana').show();
        $('#main-form').hide();
        $('#money-form').hide();
        $('.fondo').show();


    });

    // En caso de que se aprete el botón "Depositar".
    $('#depositar').click((e) => {
        e.preventDefault();
        $('#select-form').hide();
        $('#money-form').show();
        $('#retirarTexto').hide();
        $('#realizarRetiro').hide();

        for (let cliente of clientes) {
            if (cliente.id == idEdit) {
                dineroActual.val(cliente.dinero);
            }
        }
    });

    // En caso de que se aprete el botón "Aceptar" en el modo depósito.
    $('#realizarDeposito').click((e) => {
        e.preventDefault();
        $('#retirarTexto').show();
        $('#depositarTexto').show();
        $('#select-form').hide();
        $('#ventana').hide();
        $('#realizarRetiro').show();
        $('#realizarDeposito').show();
        $('.fondo').hide();



        for (let cliente of clientes) {
            if (cliente.id == idEdit) {
                let filaEdit = $(`#${idEdit}`);
                cliente.dinero += Number(monto.val());
                filaEdit[0].children[4].innerText = cliente.dinero;
            }
        }
        monto.val("");


        // Guardado de información en storage.
        let clientesJSON = JSON.stringify(clientes);
        localStorage.setItem('clientes', clientesJSON);
    });

    // En caso de que se aprete el botón "Retirar".
    $('#retirar').click((e) => {
        e.preventDefault();
        $('#select-form').hide();
        $('#money-form').show();
        $('#depositarTexto').hide();
        $('#realizarDeposito').hide();
        $('.fondo').show();


        for (let cliente of clientes) {
            if (cliente.id == idEdit) {
                dineroActual.val(cliente.dinero);
            }
        }
    });


    // En caso de que se aprete el botón "Aceptar" en el modo retiro.
    $('#realizarRetiro').click((e) => {
        e.preventDefault();

        for (let cliente of clientes) {
            if (cliente.id == idEdit) {
                if (cliente.dinero < Number(monto.val()) || Number(monto.val()) < 0){
                    $('#error2').show();
                    return;
                }
                let filaEdit = $(`#${idEdit}`);
                cliente.dinero -= Number(monto.val());
                filaEdit[0].children[4].innerText = cliente.dinero;
            }
        }
        $('#error2').hide();
        monto.val(""); 

        $('#retirarTexto').show();
        $('#depositarTexto').show();
        $('#select-form').hide();
        $('#ventana').hide();
        $('#realizarRetiro').show();
        $('#realizarDeposito').show();
        $('.fondo').hide();
        
        // Guardado de información en storage.
        let clientesJSON = JSON.stringify(clientes);
        localStorage.setItem('clientes', clientesJSON);
    });




    // En caso de que se aprete el botón "Atrás".
    $('#volver').click((e) => {
        e.preventDefault();
        $('#error2').hide();
        $('#select-form').show();
        $('#money-form').hide();
        $('#depositarTexto').show();
        $('#retirarTexto').show();
        $('#realizarRetiro').show();
        $('#realizarDeposito').show();
        monto.val("");

    });

    // En caso de que se aprete el botón "Cancelar".
    $('#cancelarM').click((e) => {
        e.preventDefault();
        $('#error2').hide();
        $('#retirarTexto').show();
        $('#depositarTexto').show();
        $('#select-form').hide();
        $('#ventana').hide();
        $('#realizarRetiro').show();
        $('#realizarDeposito').show();
        $('.fondo').hide();
        monto.val("");

    });



})