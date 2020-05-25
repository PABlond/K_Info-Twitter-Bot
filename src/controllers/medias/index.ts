import _LeMonde from './_LeMonde.ctrl'
import _20Minutes from './_20minutes.ctrl'
import _LeParisien from './_LeParisien.ctrl'
import _HuffingtonPost from './_HuffingtonPost.ctrl'
import _LeFigaro from './_LeFigaro.ctrl'

export default [
    { title: "Le Monde", instance: new _LeMonde() },
    { title: "20Minutes", instance: new _20Minutes() },
    { title: "Le Parisien", instance: new _LeParisien() },
    { title: "Le HuffPost", instance: new _HuffingtonPost() },
    { title: "Le Figaro", instance: new _LeFigaro() },
]
