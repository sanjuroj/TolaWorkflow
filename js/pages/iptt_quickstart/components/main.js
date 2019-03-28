import React from 'react';
import { inject, observer } from 'mobx-react';
import { QSTVAProgramSelect, QSTVAPeriodSelect, QSTimeperiodsProgramSelect } from './selects';
import { QSTVATimeFrameRadio } from './radios';
import { IPTTSubmit } from './buttons';

const QuickstartCard = ({ children }) => {
    return <div className="col-sm-6">
                <div className="card">
                    <div className="card-body">
                        { children }
                    </div>
                </div>
            </div>;
}

const TVAQuickstartForm = inject('labels')(
    observer(({ labels }) => {
        return <QuickstartCard>
                    <h5 className="card-title">{ labels.tvaFilterTitle }</h5>
                    <p className="card-subtitle text-muted mb-2">{ labels.tvaFilterSubtitle }</p>
                    <QSTVAProgramSelect />
                    <QSTVAPeriodSelect />
                    <QSTVATimeFrameRadio />
                    <IPTTSubmit url={'tvaURL' } />
                </QuickstartCard>;
    })
);

const TimeperiodsQuickstartForm = inject('labels')(
    observer(({ labels  }) => {
        return <QuickstartCard>
                    <h5 className="card-title">{ labels.timeperiodsFilterTitle }</h5>
                    <p className="card-subtitle text-muted mb-2">{ labels.timeperiodsFilterSubtitle }</p>
                    <QSTimeperiodsProgramSelect />
                    <IPTTSubmit url={'timeperiodsURL'} />
                </QuickstartCard>;
    })
);

export const IPTTQuickstartForm = () => {
    return <div className="row">
                <TVAQuickstartForm />
                <TimeperiodsQuickstartForm />
           </div>;
}