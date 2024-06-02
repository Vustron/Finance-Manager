import { Button } from '@/components/ui/button';
import { useCSVReader } from 'react-papaparse';
import { Upload } from 'lucide-react';

type Props = {
	onUpload: (results: any) => void;
};

const UploadButton = ({ onUpload }: Props) => {
	const { CSVReader } = useCSVReader();

	// TODO: add paywall
	return (
		<CSVReader onUploadAccepted={onUpload}>
			{({ getRootProps }: any) => (
				<Button size='sm' className='w-full lg:w-auto' {...getRootProps()}>
					<Upload className='size-4 mr-2' />
					import
				</Button>
			)}
		</CSVReader>
	);
};

export default UploadButton;
