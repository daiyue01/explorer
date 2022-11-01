
var vAppFooter = new Vue({
    el: '#footer',
    data: {
    },
    methods:{
        choiseLang: function(lang) {
            setCookie("lang", lang, "/", 1000) 
            window.location.href += "" 
        },
    }
})

