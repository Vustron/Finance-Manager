import Image from 'next/image';
import Link from 'next/link';

const HeaderLogo = () => {
	return (
		<Link href='/'>
			<div className='items-center hidden lg:flex'>
				<Image src='/logo.svg' height={28} width={28} alt='logo' priority />
				<p className='font-semibold text-white text-2xl ml-2.5'>
					Finance Manager
				</p>
			</div>
		</Link>
	);
};

export default HeaderLogo;
