import React, { useState, useEffect } from 'react';
import { Category, Product } from './types';
import { Button, Select, MenuItem, CircularProgress } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useFetchCategoriesQueryQuery,useFetchProductsByCategoryQuery } from './Redux/appSlices';
const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>(null);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const  {data :categoryData,isError,isSuccess} = useFetchCategoriesQueryQuery('');

  const  {data : productData,isLoading:catLoading,isError:boolean,isSuccess:success} = useFetchProductsByCategoryQuery(selectedCategory, { skip: !trigger });
  useEffect(() => {
    setChartData(generatePieChart(categoryData));
    setCategories(categoryData);    
  }, [categoryData]);

  useEffect(() => {
    if (productData && selectedCategory) {
    setProducts(productData?.products || [])
    }

  }, [productData,selectedCategory]);

  const handleCategoryChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    setTrigger(true);
    const category = event.target.value as string;
    setSelectedCategory(category);
  };

  const handleProductChange = (event: any) => {
    const selected = event.target.value as string[];
    setSelectedProducts(selected);
  };

  const handleClear = () => {
    setSelectedCategory(null);
    setSelectedProducts([]);
    setChartData(generatePieChart(categories));
  };

  const handleRunReport = () => {
    if (!selectedCategory) return;

    setIsLoading(true);
    setTimeout(() => {
      const data = selectedProducts.length ? generateBarChart(selectedProducts) : generateBarChart(products);
      setChartData(data);
      setIsLoading(false);
    }, 3000);
  };
//create the Pie Chart
  const generatePieChart = (categoryData: any) => ({
    chart: { type: 'pie' },
    title: { text: 'Product Categories' },
    series: [{ data: categoryData?.map((cat:any, int:any) => ({ name: cat.name, y: 5})) }]
  });

  //create the Bar Chart
  const generateBarChart = (products: Product[]) => ({
    chart: { type: 'column' },
    title: { text: 'Products in selected Category' },

    yAxis: {
      min: 0,
      title: {
        text: products[0]?.category
      }
    },

    series: [{
      name: 'Products',
      data: products?.map(prod => ({ name: prod?.title, y: prod?.price })),
      
    }]
  });

  return (
    <div className='main'>
      <div className='subMain'>
        <div className='subMaindiv'>
          <div className='subDiv'>
            <p>Filters</p>
            <Button variant="contained" style={{height:32,marginTop:"4%"}} onClick={handleClear}>Clear</Button>
          </div>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select Category</InputLabel>
            <Select
              className='menuItem'
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Select Category"
              value={selectedCategory}
              onChange={(value: any) => handleCategoryChange(value)}>
              {categories?.map(category => (
                <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="label2">Select Products</InputLabel>
            <Select
              className='menuItem'
              labelId="label2"
              id="demo-simple-select"
              multiple
              label="Select Products"
              value={selectedProducts}
              onChange={(value: any) => handleProductChange(value)}
              disabled={!selectedCategory}
            >

              {products?.map(product => (
                //@ts-ignore - necessary to load object into value
                <MenuItem key={product.id} value={product}>{product.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Button variant="contained" style={{marginBottom:'8vh'}} onClick={() => handleRunReport()} disabled={!selectedCategory || isLoading}>Run Report</Button>
      </div>
      <div className='subMain2'>
        {isLoading ? <CircularProgress /> : <HighchartsReact containerProps={{ style: { height: "86%" } }} highcharts={Highcharts} options={chartData} />}
      </div>
    </div>
  );
};

export default App;
