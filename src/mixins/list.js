import { reqPlaylist, reqPlaylistDetail } from "@/api/home";
import List from "@/components/List";

export default {
    props: ["id"],
    data() {
        return {
            backgroundImage: undefined,
            title: "",
            list: [],
            loading: true,
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            try {
                const {
                    playlist: { coverImgUrl, name },
                } = await reqPlaylistDetail(this.id);
                const { songs } = await reqPlaylist(this.id);
                this.backgroundImage = `url(${coverImgUrl})`;
                this.title = name;
                this.list = songs.map((song) => ({
                    id: song.al.id,
                    name: song.al.name,
                    singer: song.ar.map((item) => item.name).join(" / "),
                }));
                this.loading = false;
            } catch (error) {
                this.$toast("加载失败");
                this.loading = false;
            }
        },
    },
    components: {
        List,
    },
};
