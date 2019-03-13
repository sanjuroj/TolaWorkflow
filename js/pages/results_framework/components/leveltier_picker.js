import React from 'react';
import classNames from 'classnames';
import { observer } from "mobx-react"
import eventBus from '../../../eventbus';
import {IndicatorFilterType} from "../models";
import {localDateFromISOString} from "../../../date_utils";


@observer
class LevelTierPicker extends React.Component {

    render() {

        return <div>Help! I'm trapped!</div>
    }
}

export const LevelTierPickerExport = observer(function (props) {

    return <div>
        <React.Fragment>
            <LevelTierPicker />
        </React.Fragment></div>
});
