document.addEventListener('DOMContentLoaded', async function () {
    // --- Menú Desplegable ---
    const dropdownButton = document.querySelector('.btn[data-toggle="collapse"]');
    const dropdownMenu = document.querySelector('#navbar-vertical');
  
    if (dropdownButton && dropdownMenu) {
      dropdownButton.addEventListener('click', function (event) {
        event.preventDefault();
        dropdownMenu.classList.toggle('show');
      });
  
      document.addEventListener('click', function (event) {
        if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
          dropdownMenu.classList.remove('show');
        }
      });
    }
  
    // //Apartado de Componentes en el Home-Start
    // const equiposContainer = document.getElementById("equipos-container");
  
    // if (!equiposContainer) {
    //   console.error("No se encontró el contenedor 'equipos-container'. Verifica el ID en el HTML.");
    //   return;
    // }
  
    // try {
    //   const apiURL = "https://pokeapi.co/api/v2/pokemon?limit=8";
  
    //   const response = await fetch(apiURL);
    //   const data = await response.json();
  
    //   const productos = await Promise.all(
    //     data.results.map(async (producto, index) => {
    //       const detalleResponse = await fetch(producto.url);
    //       const detalleData = await detalleResponse.json();
  
    //       return {
    //         nombre: producto.name,
    //         precio: (index + 1) * 100,
    //         img: detalleData.sprites.front_default,
    //       };
    //     })
    //   );
  
    //   productos.forEach((producto) => {
    //     const productoDiv = document.createElement("div");
    //     productoDiv.className = "col-lg-3 col-md-4 col-sm-6 pb-1";
  
    //     productoDiv.innerHTML = `
    //       <div class="product-item bg-light mb-4">
    //         <div class="product-img position-relative overflow-hidden">
    //           <img class="img-fluid w-100" src="${producto.img}" alt="${producto.nombre}" />
    //         </div>
    //         <div class="text-center py-4">
    //           <a class="h6 text-decoration-none text-truncate" href="#">${producto.nombre}</a>
    //           <div class="d-flex align-items-center justify-content-center mt-2">
    //             <h5>$${producto.precio.toFixed(2)}</h5>
    //           </div>
    //         </div>
    //       </div>
    //     `;
  
    //     equiposContainer.appendChild(productoDiv);
    //   });
    // } catch (error) {
    //   console.error("Error al obtener los datos de la API:", error);
    // }
    // //Apartado de Equipos en el Home-End


    // //Apartado de Componentes en el Home-Start
    //  const compoContainer = document.getElementById("compo-container");
  
    //  if (!compoContainer) {
    //    console.error("No se encontró el contenedor 'compo-container'. Verifica el ID en el HTML.");
    //    return;
    //  }
   
    //  try {
    //    const apiURL = "https://pokeapi.co/api/v2/pokemon?limit=8";
   
    //    const response = await fetch(apiURL);
    //    const data = await response.json();
   
    //    const productos = await Promise.all(
    //      data.results.map(async (producto, index) => {
    //        const detalleResponse = await fetch(producto.url);
    //        const detalleData = await detalleResponse.json();
   
    //        return {
    //          nombre: producto.name,
    //          precio: (index + 1) * 100,
    //          img: detalleData.sprites.front_default,
    //        };
    //      })
    //    );
    //    productos.forEach((producto) => {
    //      const productoDiv = document.createElement("div");
    //      productoDiv.className = "col-lg-3 col-md-4 col-sm-6 pb-1";
   
    //      productoDiv.innerHTML = `
    //        <div class="product-item bg-light mb-4">
    //          <div class="product-img position-relative overflow-hidden">
    //            <img class="img-fluid w-100" src="${producto.img}" alt="${producto.nombre}" />
    //          </div>
    //          <div class="text-center py-4">
    //            <a class="h6 text-decoration-none text-truncate" href="#">${producto.nombre}</a>
    //            <div class="d-flex align-items-center justify-content-center mt-2">
    //              <h5>$${producto.precio.toFixed(2)}</h5>
    //            </div>
    //          </div>
    //        </div>
    //      `;
   
    //      compoContainer.appendChild(productoDiv);
    //    });
    //  } catch (error) {
    //    console.error("Error al obtener los datos de la API:", error);
    //  }
    //  //Apartado de Componentes en el Home-End
  });
  