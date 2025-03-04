import Image from 'next/image';

export default function MacBook() {
  return (
    <div className="macbook">
      <div className="inner">
        <div className="screen">
          <div className="face-one">
            <div className="camera"></div>
            <div className="display">
              <div className="shade"></div>
            </div>
            <span className="sr-only">MacBook Air</span>
          </div>
          <Image
            width={100}
            height={100}
            alt="apple logo"
            src="http://www.clker.com/cliparts/i/s/H/f/4/T/apple-logo-white.svg"
            className="logo"
          />
        </div>
        <div className="body">
          <div className="face-one">
            <div className="touchpad"></div>
            <div className="keyboard">
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key space"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key"></div>
              <div className="key f"></div>
              <div className="key f"></div>
              <div className="key f"></div>
              <div className="key f"></div>
              <div className="key f"></div>
              <div className="key f"></div>
              <div className="key f"></div>
              <div className="key f"></div>
              <div className="key f"></div>
              <div className="key f"></div>
              <div className="key f"></div>
              <div className="key f"></div>
              <div className="key f"></div>
              <div className="key f"></div>
              <div className="key f"></div>
              <div className="key f"></div>
            </div>
          </div>
          <div className="pad one"></div>
          <div className="pad two"></div>
          <div className="pad three"></div>
          <div className="pad four"></div>
        </div>
      </div>
      <div className="shadow"></div>
    </div>
  );
}
