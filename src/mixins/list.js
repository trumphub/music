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
                this.list = songs.filter(item => item.fee === 8).map((song) => ({
                    id: song.id,
                    name: song.al.name,
                    singer: song.ar.map((item) => item.name).join(" / "),
                    picUrl: song.al.picUrl,
                    dt: song.dt,
                    status: 'stoped'
                }));
                this.loading = false;
            } catch (error) {
                this.$toast("加载失败");
                this.loading = false;
            }
        },
        handleItemClick({ list, song }) {
            this.$store.dispatch('addToPlayList', { list, song })
        }
    },
    components: {
        List,
    },
};
