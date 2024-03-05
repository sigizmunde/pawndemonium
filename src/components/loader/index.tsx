import './loader.scss';

export function Loader({length = 3}: {length?: number}) {
    return <div className='loader-wrapper'>
        {Array(length).fill(true).map((_, index) => <div key={index} className="loader-element" />)}
    </div>
}