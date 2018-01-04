// import VueFuse from './fuse.min.js';

// Vue.use(VueFuse)
Vue.use(SocialSharing)

var app = new Vue({
    el: '#app',
    created(){
        this.getData()
        if(JSON.parse(localStorage.getItem('ShoppingCart'))){
            this.shoppingCart = JSON.parse(localStorage.getItem('ShoppingCart'))
        }else {
            this.shoppingCart = [] 
        }
       
    },
    // mounted(){
    //     setTimeout(() => {
    //         if(localStorage.getItem('Search')){
    //             this.search = localStorage.getItem('Search')
    //             localStorage.removeItem('Search')
    //             this.searchProduct()
    //         }
    //     },3000)
        
    // },
    data: {
      showAddProductButton: true,
      duplicateProduct: [],
      currentCombination: {},
      combinacion: [],
      contactName: '',
      contactEmail:'',
      contactMessage: '',
      search: '',
      email: '',
      ocultar: false,
      urlHttp: 'https://brainmakers.net',
      currentProduct: null,
      valorFiltroMinimo: 100,
      valorFiltroMaximo: 500000,
      tienda: {},
      categorias: [],
      productos: [],
      productosFiltrados: [],
      banners: [],
      shoppingCart: [],
      counter: 1,
      message: 'Hello Vue!',

    },
    methods: {
        getData(){
            axios.get("https://brainmakers.net/api/front/tienda/229" ).then((response) => {
                this.tienda = response.data.data.tienda;
                document.documentElement.style.setProperty('--logo', `url("https://brainmakers.net/logos/${this.tienda.logo}")`);
                this.banners = response.data.data.banners;
                this.categorias = response.data.data.categorias;
                this.productos = response.data.data.productos;
                setTimeout(()=>{
                  global.Core.initialize();
                }, 200)
                this.timeSearch()
            })
        },
        getDataProducto(){
            var URLactual = window.location.href;
            var arrURL = URLactual.split("/", -1)
            var indexId = arrURL.length-1
            var idURL = arrURL[indexId]
            axios.get(`https://brainmakers.net/api/front/producto/${idURL}`).then((response) => {
                response.data.combinaciones.combinaciones = JSON.parse(response.data.combinaciones.combinaciones)
                this.currentProduct = response.data;
                this.combinacion = Array.from(new Array(app.currentProduct.variantes.length), () => '')
                setTimeout(()=>{
                    global.Core.initialize();
                  }, 200)
                this.persistenceProducts()
            });
        },
        render(){
            this.productosFiltrados = this.productos.filter(product => product.precio >= this.valorFiltroMinimo && product.precio <= this.valorFiltroMaximo)
        },
        sum(){
            if (this.duplicateProduct.length != 0) {
                if (this.counter < this.currentCombination.unidades - this.duplicateProduct[1].counter) {
                    this.counter = this.counter + 1  
                }
            } else {
                if (this.counter < this.currentCombination.unidades) {
                    this.counter = this.counter + 1  
                }
            }          
        },
        rest(){
            if (this.counter <= 1) {
                this.counter = 1
            }else {
                this.counter = this.counter - 1                    
            }
        },
        addProductToCart() {
            console.log(this.duplicateProduct[0])
            if (this.duplicateProduct.length !== 0) {
                this.shoppingCart[this.duplicateProduct[0]].counter += this.counter
                
            }else {
                let newProduct = {
                    counter: this.counter,
                    detalle: {
                        id: this.currentProduct.detalle.id,
                        nombre: this.currentProduct.detalle.nombre,
                        foto: this.currentProduct.detalle.foto,
                        categoria_producto: {
                            nombre_categoria_producto: this.currentProduct.detalle.categoria_producto.nombre_categoria_producto
                        }
                    },
                    currentCombination: {
                        combinacion: this.currentCombination.combinacion,
                        precio: this.currentCombination.precio,
                        unidades: this.currentCombination.unidades,
                        sku: this.currentCombination.sku
                    }
                }
                this.shoppingCart.push(newProduct)
                this.duplicateProduct = [this.shoppingCart.length - 1, newProduct]
            }
            this.counter = 1
            this.refreshLocalStorage()
            this.blockButton()
        },
        persistenceProducts() {
            this.duplicateProduct = []
            for (let [index, valor] of this.shoppingCart.entries()) {
                if (this.currentProduct.detalle.id == valor.detalle.id && this.currentCombination.combinacion.toString() == valor.currentCombination.combinacion.toString()) {
                    this.duplicateProduct = [index, valor]
                }
            }
            this.blockButton()

        },
        removeProduct(index){
            this.shoppingCart.splice(index, 1)
            if (index == this.duplicateProduct[0]) this.duplicateProduct = []
            this.refreshLocalStorage()
            this.blockButton()
        },
        refreshLocalStorage(){
            localStorage.setItem('ShoppingCart', JSON.stringify(this.shoppingCart))
        },
        searchProduct(){

            var options = {
                shouldSort: true,
                threshold: 0.6,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    "nombre",
                ]
            };

            var fuse = new Fuse(this.productos, options)
            var search  = this.search
            this.productosFiltrados = fuse.search(search)
        },
        subscriptionNewsletter(){
            let params = {
                correo: this.email,
                tienda: 229,
            }
            axios.post('http://brainmakers.net/api/front/suscriptores', params).then((response) => {
                this.email = ""
            })
        },
        setInput(){    
            localStorage.setItem("Search", this.search)    
        },
        timeSearch(){
            this.search = localStorage.getItem('Search')
            localStorage.removeItem('Search')
            this.searchProduct()
        },
        submitContact(){
            let params = {
                nombre: this.contactName,
                correo: this.contactEmail,
                celular: 0,
                comentario: this.contactMessage,
                tienda: 229
            }
            axios.post('http://brainmakers.net/api/front/mensaje-contacto', params).then((response) => {
                
            })
        },
        blockButton() {
            // this.showAddProductButton = true
            // if (this.duplicateProduct[1].counter >= this.currentCombination.unidades) {
            //     this.showAddProductButton = false 
            // }
        }


    },
    computed:{
        reverseImages: function () {
            return this.productos.slice(-5, this.productos.length).reverse()
        },
        sizeShoppingCart: function () {
            return this.shoppingCart.length
        }
    },
    filters: {
        formatNum: function (value) {
            if (value) {
                return new Intl.NumberFormat().format(value);  
            }
        }
    },
    watch:{
        combinacion (value) {
            let emptyDefault = {
                combinacion: [],
                precio: this.currentProduct.detalle.precio,
                unidades: this.currentProduct.info.inventario,
                sku: this.currentProduct.info.sku
            }
            this.currentCombination = this.currentProduct.combinaciones.combinaciones.filter( item => item.combinacion.toString() == value.toString())[0] || emptyDefault
            this.counter = 1
            this.persistenceProducts()
        },
        search: function(value) {
            this.searchProduct()
        }
       
      }
  })
