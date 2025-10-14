mixins.home={
    mounted:function o(){
        var t=this.$refs.homeBackground;
        // 检查是否为移动设备
        var isMobile = window.matchMedia("(max-width: 900px)").matches;
        // 根据设备类型选择背景图
        var images = isMobile && t.dataset.mobileImages 
            ? t.dataset.mobileImages.split(",") 
            : t.dataset.images.split(",");
        var n=Math.floor(Math.random()*images.length);
        t.style.backgroundImage="url('".concat(images[n],"')");
        this.menuColor=true
    },
    methods:{
        homeClick:function o(){
            window.scrollTo({
                top:window.innerHeight,
                behavior:"smooth"
            })
        }
    }
};