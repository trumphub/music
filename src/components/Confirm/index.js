import Vue from 'vue';
import Confirm from './Confirm.vue'

let ConfirmConstructor = Vue.extend(Confirm);

const ConfirmBox = function ({ message, cancel, confirm }) {
    const instance = new ConfirmConstructor({
        data: {
            message,
            cancel,
            confirm
        }
    });
    instance.$mount();
    document.body.appendChild(instance.$el);
};

export default ConfirmBox
