import {observable} from "mobx-react";

const AssessmentModel = Object.create(Object.prototype, {
    @observable
    title: ""
});

export {AssessmentModel as default};
