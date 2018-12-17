import React from 'react';
import classNames from 'classnames';
import { observer } from "mobx-react"
import eventBus from '../../../eventbus';
import {IndicatorFilterType} from "../models";


@observer
class GaugeTank extends React.Component {
    constructor(props) {
        super(props);

        this.onGuageClick = this.onGuageClick.bind(this);
    }

    onGuageClick() {
        eventBus.emit('apply-gauge-tank-filter', this.props.filterType);
    }

    render() {
        const tickCount = 10;

        const {allIndicatorsLength, filteredIndicatorsLength, title, filledLabel, unfilledLabel, cta, emptyLabel} = this.props;

        const filterType = this.props.filterType;
        const currentIndicatorFilter = this.props.currentIndicatorFilter;

        const isHighlighted = filterType === currentIndicatorFilter;

        const unfilledPercent = allIndicatorsLength > 0 ? Math.round((filteredIndicatorsLength / allIndicatorsLength) * 100) : 100;
        const filledPercent = 100 - unfilledPercent;

        return <div className={classNames('gauge', 'filter-trigger', {'is-highlighted': isHighlighted})}
                    onClick={this.onGuageClick}>
            <h6 className="gauge__title">{title}</h6>
            <div className="gauge__overview">
                <div
                    className="gauge__graphic gauge__graphic--tank{% if filled_percent == 0 %} gauge__graphic--empty{% endif %}">
                    <div className="graphic__tick-marks">
                        {[...Array(tickCount)].map((e, i) => <div key={i} className="graphic__tick"/>)}
                    </div>
                    <div className="graphic__tank--unfilled" style={{'flexBasis': `${unfilledPercent}%`}}/>
                    <div className="graphic__tank--filled" style={{'flexBasis': `${filledPercent}%`}}/>
                </div>
                <div className="gauge__labels">
                    {filledPercent > 0 ?

                        <React.Fragment>
                            <div className="gauge__label text-muted">
                                {unfilledPercent}% {unfilledLabel}
                            </div>
                            <div className="gauge__label">
                                <span className="gauge__value">{filledPercent}% {filledLabel}</span>
                            </div>
                        </React.Fragment>

                        :

                        <div className="gauge__label">
                            <span className="text-danger"><strong>{emptyLabel}</strong></span>
                        </div>
                    }
                </div>
            </div>
            <div className="gauge__cta">
                { unfilledPercent > 0 &&
                    <span className="btn-link btn-inline"><i className="fas fa-exclamation-triangle text-warning"/> {cta}</span>
                }
                &nbsp;
            </div>
        </div>;
    }
}


@observer
class GaugeBand extends React.Component {
    constructor(props) {
        super(props);

        this.handledFilterTypes = new Set([
            IndicatorFilterType.aboveTarget,
            IndicatorFilterType.belowTarget,
            IndicatorFilterType.onTarget,
        ]);

        this.onFilterLinkClick = this.onFilterLinkClick.bind(this);
    }

    componentDidUpdate() {
        // Enable popovers after update (they break otherwise)
        $(this.el).find('[data-toggle="popover"]').popover({
            html: true
        });
    }

    onFilterLinkClick(e, filterType) {
        e.preventDefault();
        eventBus.emit('apply-gauge-tank-filter', filterType);
    }

    render() {
        const tickCount = 10;

        const {indicatorStore} = this.props;

        const currentIndicatorFilter = this.props.currentIndicatorFilter;

        const isHighlighted = this.handledFilterTypes.has(currentIndicatorFilter);

        const totalIndicatorCount = indicatorStore.indicators.length;
        const nonReportingCount = indicatorStore.getIndicatorsNotReporting.length;
        const highCount = indicatorStore.getIndicatorsAboveTarget.length;
        const lowCount = indicatorStore.getIndicatorsBelowTarget.length;
        const onTargetCount = indicatorStore.getIndicatorsOnTarget.length;

        const makePercent = totalIndicatorCount > 0 ? (x) => Math.round((x / totalIndicatorCount) * 100) : (x) => 0;

        const percentHigh = makePercent(highCount);
        const percentOnTarget = makePercent(onTargetCount);
        const percentBelow = makePercent(lowCount);
        const percentNonReporting = makePercent(nonReportingCount);

        const marginPercent = this.props.indicatorOnScopeMargin * 100;

        // Top level wrapper of component
        let Gauge = (props) => {
            return <div className={classNames('gauge', {'is-highlighted': isHighlighted})} ref={el => this.el = el}>
                <h6 className="gauge__title">{gettext('Indicators on track')}</h6>
                <div className="gauge__overview">
                    {props.children}
                </div>
            </div>
        };


        if (indicatorStore.getTotalResultsCount === 0) {
            return <Gauge>
                <div>
                    {/* Translators: message describing why this display does not show any data. */}
                    <p className="text-muted">{gettext("Unavailable until results are reported")}</p>
                    <div>
                        <i className="gauge__icon gauge__icon--error fas fa-frown"/>
                    </div>
                </div>
            </Gauge>;
        }

        if (indicatorStore.getIndicatorsReporting.length === 0) {
            return <Gauge>
                <div className="gauge__graphic gauge__graphic--empty gauge__graphic--performance-band">
                    <div className="graphic__tick-marks">
                        {[...Array(tickCount)].map((e, i) => <div key={i} className="graphic__tick" />)}
                    </div>
                </div>
                <div className="gauge__labels">
                    <div className="gauge__label">
                        {/* Translators: message describing why this display does not show any data. */}
                        <p className="text-muted">{gettext("Unavailable until the first target period ends with results reported")}</p>
                    </div>
                </div>
            </Gauge>;
        }

        // Handle strings containing HTML markup

        const aboveTargetMarkup = () => {
            /* Translators: variable %(percentHigh)s shows what percentage of indicators are a certain percentage above target percent %(marginPercent)s. Example: 31% are >15% above target */
            let s = gettext('<strong>%(percentHigh)s%</strong> are >%(marginPercent)s% above target');
            return {__html: interpolate(s, {percentHigh, marginPercent}, true)};
        };

        const onTargetMarkup = () => {
            /* Translators: variable %s shows what percentage of indicators are within a set range of target. Example: 31%  are on track */
            let s = gettext('<strong>%s%</strong> are on track');
            return {__html: interpolate(s, [percentOnTarget])};
        };

        const belowTargetMarkup = () => {
            /* Translators: variable %(percentBelow)s shows what percentage of indicators are a certain percentage below target. The variable %(marginPercent)s is that percentage. Example: 31% are >15% below target */
            let s = gettext('<strong>%(percentBelow)s%</strong> are >%(marginPercent)s% below target');
            return {__html: interpolate(s, {percentBelow, marginPercent}, true)};
        };


        return <Gauge>
            <div className="gauge__graphic gauge__graphic--performance-band">
                <div className="graphic__tick-marks">
                    {[...Array(tickCount)].map((e, i) => <div key={i} className="graphic__tick" />)}
                </div>
                <div className="graphic__performance-band--above-target"
                     style={{'flexBasis': `${percentHigh}%`}}/>
                <div className="graphic__performance-band--on-target"
                     style={{'flexBasis': `${percentOnTarget}%`}}/>
                <div className="graphic__performance-band--below-target"
                     style={{'flexBasis': `${percentBelow}%`}}/>
            </div>
            <div className="gauge__labels">
                <div className="gauge__label">
                    <span className="text-muted">
                        {
                            /* Translators: variable %s shows what percentage of indicators have no targets reporting data. Example: 31% unavailable */
                            interpolate(gettext('%s% unavailable'), [percentNonReporting])
                        }
                    </span>
                    {' '}
                    <a href="#"
                       tabIndex="0"
                       data-toggle="popover"
                       data-placement="right"
                       data-trigger="focus"
                       data-content={
                           /* Translators: help text for the percentage of indicators with no targets reporting data. */
                           gettext("The indicator has no targets, no completed target periods, or no results reported.")
                       }
                       onClick={e => e.preventDefault()}
                    ><i className="far fa-question-circle"/></a>
                </div>
                <div className="gauge__label">
                    <span className="gauge__value--above filter-trigger--band"
                          onClick={e => this.onFilterLinkClick(e, IndicatorFilterType.aboveTarget)}
                          dangerouslySetInnerHTML={aboveTargetMarkup()}>
                    </span>
                </div>
                <div className="gauge__label">
                    <span className="gauge__value filter-trigger--band"
                          onClick={e => this.onFilterLinkClick(e, IndicatorFilterType.onTarget)}
                          dangerouslySetInnerHTML={onTargetMarkup()}>
                    </span>
                    {' '}
                    <a href="#"
                       tabIndex="0"
                       data-toggle="popover"
                       data-placement="right"
                       data-trigger="focus"
                       data-content={
                           /* Translators: Help text explaining what an "on track" indicator is. */
                           gettext('The actual value matches the target value, plus or minus 15%. So if your target is 100 and your result is 110, the indicator is 10% above target and on track.  <br><br>Please note that if your indicator has a decreasing direction of change, then “above” and “below” are switched. In that case, if your target is 100 and your result is 200, your indicator is 50% below target and not on track.')
                       }
                       onClick={e => e.preventDefault()}
                    ><i className="far fa-question-circle"/></a>
                </div>
                <div className="gauge__label">
                    <span className="gauge__value--below filter-trigger--band"
                          onClick={e => this.onFilterLinkClick(e, IndicatorFilterType.belowTarget)}
                          dangerouslySetInnerHTML={belowTargetMarkup()}>
                    </span>
                </div>
            </div>
        </Gauge>;
    }
}


export const ProgramMetrics = observer(function (props) {
    // const program = props.rootStore.program;
    const indicatorStore = props.rootStore.indicatorStore;
    const indicators = indicatorStore.indicators;

    const currentIndicatorFilter = props.uiStore.currentIndicatorFilter;

    const indicatorOnScopeMargin = this.props.indicatorOnScopeMargin;

    // Use objs for labels below to allow for translator notes to be added

    const targetLabels = {
        /* Translators: title of a graphic showing indicators with targets */
        title: gettext("Indicators with targets"),

        /* Translators: a label in a graphic. Example: 31% have targets */
        filledLabel: gettext("have targets"),

        /* Translators: a label in a graphic. Example: 31% no targets */
        unfilledLabel: gettext("no targets"),

        cta: gettext("Add missing targets"),

        emptyLabel: gettext("No targets"),
    };

    const resultsLabels = {
        /* Translators: title of a graphic showing indicators with results */
        title: gettext("Indicators with results"),

        /* Translators: a label in a graphic. Example: 31% have results */
        filledLabel: gettext("have results"),

        /* Translators: a label in a graphic. Example: 31% no results */
        unfilledLabel: gettext("no results"),

        cta: gettext("Add missing results"),

        emptyLabel: gettext("No results"),
    };

    const evidenceLabels = {
        /* Translators: title of a graphic showing results with evidence */
        title: gettext("Results with evidence"),

        /* Translators: a label in a graphic. Example: 31% have evidence */
        filledLabel: gettext("have evidence"),

        /* Translators: a label in a graphic. Example: 31% no evidence */
        unfilledLabel: gettext("no evidence"),

        cta: gettext("Add missing evidence"),

        emptyLabel: gettext("No evidence"),
    };

    // Do not display on pages with no indicators
    if (indicators.length === 0) return null;

    return <aside className="program__status">
        <h2>{gettext("Program metrics")}</h2>
        <div className="status__gauges">

            <GaugeBand currentIndicatorFilter={currentIndicatorFilter}
                       indicatorOnScopeMargin={indicatorOnScopeMargin}
                       indicatorStore={indicatorStore}
            />

            <GaugeTank filterType={IndicatorFilterType.missingTarget}
                       currentIndicatorFilter={currentIndicatorFilter}

                       allIndicatorsLength={indicators.length}
                       filteredIndicatorsLength={indicatorStore.getIndicatorsNeedingTargets.length}

                       {...targetLabels}
                       />

            <GaugeTank filterType={IndicatorFilterType.missingResults}
                       currentIndicatorFilter={currentIndicatorFilter}

                       allIndicatorsLength={indicators.length}
                       filteredIndicatorsLength={indicatorStore.getIndicatorsNeedingResults.length}

                       {...resultsLabels}
                       />

            <GaugeTank filterType={IndicatorFilterType.missingEvidence}
                       currentIndicatorFilter={currentIndicatorFilter}

                       // The names below are misleading as this gauge is measuring *results*, not indicators
                       allIndicatorsLength={indicatorStore.getTotalResultsCount}
                       filteredIndicatorsLength={indicatorStore.getTotalResultsCount - indicatorStore.getTotalResultsWithEvidenceCount}

                       {...evidenceLabels}
                       />

        </div>
    </aside>
});
