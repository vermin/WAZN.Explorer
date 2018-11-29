import * as React from 'react';
import { fetchAsync } from 'utils/functions';
import { LineGraph, Point } from '..';
import './wazn.scss';

interface Props {
  width: number;
  height: number;
}

interface State {
  fetchingData: boolean;
  data: Point[];
}

export class WaznGraph extends React.Component<Props, State> {
  public state = {
    fetchingData: false,
    data: [] as Point[]
  };

  public componentDidMount() {
    this.fetchData();
  }

  public fetchData = () => {
    this.setState({ fetchingData: true });
    fetchAsync('https://proxy.wazn.io/mv')
      .then((json: any) => {
        if (json) {
          this.setState({ fetchingData: false });
          this.setState({ data: this.formatRawData(json.Data) });
        } else {
          throw new Error('Failed to fetch WAZN data');
        }
      })
      .catch(error => {
        this.setState({ fetchingData: false });
        console.log(error.message);
      });
  };

  public formatRawData = (data: any) => {
    return data.map((point: { [key: string]: number }, i: number) => {
      return [i, point.close, point.time];
    });
  };

  public render() {
    const { width, height } = this.props;
    const { fetchingData, data } = this.state;
    const current = data[0] ? data[data.length - 1][1] : 0;
    const oldest = data[0] ? data[0][1] : 0;
    const diff = current - oldest;
    const diffPercent =
      oldest < current ? ((diff / oldest) * 100).toFixed(2) : ((diff / current) * 100).toFixed(2);
    const low = data[0] ? data.reduce((min, p) => (p[1] < min ? p[1] : min), data[0][1]) : 0;
    const high = data[0] ? data.reduce((max, p) => (p[1] > max ? p[1] : max), data[0][1]) : 0;

    return !fetchingData && !!data[0] ? (
      <div className="wazn-price">
        <div className="wazn-price-header">
          <p className="title">WAZN Price</p>
          <div className="flex-spacer" />
          <p className="time">7d</p>
        </div>
        <div className="wazn-price-data">
          <div className="left">
            <h2 className="wazn-price-data-current">
              {current.toLocaleString(
                'us-EN',
                { style: 'currency', currency: 'USD' }
              )}
            </h2>
            <p className={`wazn-price-data-difference ${diff > 0 ? 'positive' : 'negative'}`}>
              {diff.toLocaleString(
                'us-EN',
                { style: 'currency', currency: 'USD' }
              )}{' '}
              ({diffPercent}%)
            </p>
          </div>
          <div className="flex-spacer" />
          <div className="right">
            <div className="wazn-price-data-high">
              <span className="label">High</span>
              <div className="flex-spacer" />
              <span className="value">
                {high.toLocaleString(
                  'us-EN',
                  { style: 'currency', currency: 'USD' }
                )}
              </span>
            </div>
            <div className="wazn-price-data-low">
              <span className="label">Low</span>
              <div className="flex-spacer" />
              <span className="value">
                {low.toLocaleString(
                  'us-EN',
                  { style: 'currency', currency: 'USD' }
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-spacer" />
        <LineGraph id="wazn-price-graph" data={data} width={width} height={height} />
      </div>
    ) : (
      // Skeleton graph
      <div className="wazn-price">
        <div className="wazn-price-header">
          <p className="title">WAZN Price</p>
          <div className="flex-spacer" />
          <p className="time">7d</p>
        </div>
        <div className="wazn-price-data" aria-hidden={true}>
          <div className="left">
            <h2 className="wazn-price-data-current skeleton">—————</h2>
            <p
              className={`wazn-price-data-difference ${diff > 0 ? 'positive' : 'negative'} skeleton`}
            >
              —————
            </p>
          </div>
          <div className="flex-spacer" />
          <div className="right">
            <div className="wazn-price-data-high">
              <span className="label skeleton">———</span>
              <div className="flex-spacer" />
              <span className="value skeleton">—————</span>
            </div>
            <div className="wazn-price-data-low">
              <span className="label skeleton">———</span>
              <div className="flex-spacer" />
              <span className="value skeleton">—————</span>
            </div>
          </div>
        </div>
        <div className="flex-spacer" />
        <LineGraph
          id="wazn-price-graph"
          data={[[0, 0, 0], [1, 0, 0]]}
          width={width}
          height={height}
        />
      </div>
    );
  }
}
