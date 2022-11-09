
var vAppFooter = new Vue({
    el: '#footer',
    data: {
    },
    methods:{
        choiseLang: function(lang) {
            setCookie("lang", lang, "/", 5) 
            window.location.href += "" 
        },
        choiseTheme: function(theme) {
            setCookie("theme", theme, "/", 300) 
            window.location.href += ""
        },
    }
})

