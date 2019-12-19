import { IParticipant } from "../interfaces/common.interfaces"

export interface IApplicationState {
    participants: IParticipant[]
    winner?: IParticipant 
}

export const initState: IApplicationState = {
    participants: [{name:"Grandma", schools:["Columbia"], score: 0}],
    winner: undefined, 
}

export const reducer = (
    state = initState,
) => {

}