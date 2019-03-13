import React from 'react';
import classNames from 'classnames';
import { observer } from "mobx-react"
import eventBus from '../../../eventbus';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import {IndicatorFilterType} from "../models";
import Select from 'react-select';


library.add(faCaretDown, faCaretRight);






@observer
class LevelList extends React.Component {

    render() {
        return <div>In a code factory!</div>

    }
}


export const LevelListExport = observer(function (props) {

    return <React.Fragment>
        <LevelList />
    </React.Fragment>
});
