#!/usr/bin/perl

use strict;
use warnings;

my @nums = ();
# my @nums = (0..10);


for my $i (0..10) {
	$nums[$i] = $i * 5;
}


# Pass in reference (pointer) to array
fisher_yates_shuffle(\@nums);

my $a = 0;

my $b = 0;
my $c = 0;

my $j = 0;
my $k = 0;

# print "$nums";
for my $j2 (1..8) {
	$j = 16 - 2 * $j2 + 1;
	$k = $j - 1;
	for my $i (1..10) {
		
		$a = $nums[$i - 1] / 100;
		$a += $j2 / 2;

		$c = 2 * $i;
		$b = $c - 1;

		# printf "%.1f ", $a;
		print ".logo > .logoR:nth-child($j) > span:nth-child(n+$b):nth-child(-n+$c) {\n";
		printf("	animation-delay: %.2fs;\n", $a);
		print "}\n";
		if ($k != 0) {
			print ".logo > .logoR:nth-child($k) > span:nth-child(n+$b):nth-child(-n+$c) {\n";
			printf("	animation-delay: %.2fs;\n", $a);
			print "}\n";
		}
	}
	$a = $nums[10] / 100;
	$a += $j2 / 2;
	print ".logo > .logoR:nth-child($j) > span:nth-child(21) {\n";
	printf("	animation-delay: %.2fs;\n", $a);
	print "}\n";
	if ($k != 0) {
		print ".logo > .logoR:nth-child($k) > span:nth-child(21) {\n";
		printf("	animation-delay: %.2fs;\n", $a);
		print "}\n";
	}
}


sub fisher_yates_shuffle
{
    my $array = shift;

    # Get size of array
    my $i = @$array; 
    while ( --$i )
    {
        my $j = int rand( $i+1 );
        # Swap value at $i with random index before $i.
        @$array[$i,$j] = @$array[$j,$i];
    }
}