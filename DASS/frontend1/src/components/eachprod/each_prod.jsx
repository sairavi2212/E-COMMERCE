import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BasicCard = ({ product , userId}) => {
  const navigate = useNavigate();
  const [count, setCount] = React.useState(product.count);
  const isSeller = product.seller_id === userId;
  const handleExploreClick = () => {
    console.log(`Navigating to product ${product._id}`);
    navigate(`/product/${product._id}`);
  };

  const handleDecreaseCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to update the cart");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4000/decreasecount/${product._id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setCount(count - 1); // Update the count in the UI
    } catch (err) {
      console.error("Error decreasing product count:", err);
      alert("Failed to decrease product count");
    }
  };

  const handleIncreaseCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to update the cart");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4000/addtocart/${product._id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setCount(count + 1); // Update the count in the UI
    } catch (err) {
      console.error("Error increasing product count:", err);
      alert("Failed to increase product count");
    }
  };

  return (
    <Card
      sx={{
        width: 320,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        gap: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Typography
        level="h2"
        sx={{
          fontSize: '1.25rem',
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#1a1a1a',
          mb: 1
        }}
      >
        {product.name}
      </Typography>

      <AspectRatio
        ratio="4/3"
        sx={{
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '8px',
          }}
        />
      </AspectRatio>

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div>
            <Typography level="body2" sx={{ color: '#666' }}>
              Price
            </Typography>
            <Typography
              sx={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#2e7d32'
              }}
            >
              ${product.price}
            </Typography>
          </div>
          <div>
            <Typography level="body2" sx={{ color: '#666' }}>
              Seller
            </Typography>
            <Typography sx={{ color: '#1a1a1a' }}>
              {product.sellerName}
            </Typography>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '4px',
              backgroundColor: '#f5f5f5',
            }}
          >
            <IconButton
              size="sm"
              onClick={handleDecreaseCount}
              disabled={count <= 0}
              sx={{ color: '#666' }}
            >
              <RemoveIcon />
            </IconButton>
            <Typography
              sx={{
                margin: '0 12px',
                minWidth: '24px',
                textAlign: 'center',
              }}
            >
              {count}
            </Typography>
            <IconButton
              size="sm"
              onClick={handleIncreaseCount}
              disabled={isSeller}
              sx={{ color: '#666' }}
            >
              <AddIcon />
            </IconButton>
          </div>

          <Button
            variant="solid"
            size="sm"
            color="primary"
            onClick={handleExploreClick}
            sx={{
              fontWeight: 600,
              minWidth: '100px',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Explore
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicCard;
