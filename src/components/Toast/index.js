import Vue from 'vue';
import Toast from './Toast.vue'

let ToastConstructor = Vue.extend(Toast);

let instance

const Message = function (options) {
    instance && instance.close()
    if (typeof options === 'string') {
        options = {
            message: options
        }
    }
    instance = new ToastConstructor({
        data: options
    });
    instance.$mount();
    document.body.appendChild(instance.$el);
};

export default Message
